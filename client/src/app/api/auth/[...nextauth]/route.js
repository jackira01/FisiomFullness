import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { cookies } from 'next/headers';

/** @type {import("next-auth").NextAuthOptions} */
export const authOptions = {
  pages: { signIn: '/login' },
  providers: [
    // Proveedor de autenticación con credenciales
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Formulario Next Auth',
        },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, _req) {
        console.log('Autenticando con credenciales:', credentials);

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.error('Error de autenticación:', res.status);
            throw new Error('Credenciales inválidas');
          }

          const headerCookies = res.headers.getSetCookie();
          console.log('Cookies del encabezado:', headerCookies);

          const accessTokenValues = Object.fromEntries(
            (headerCookies.find((c) => c.includes('accessToken=')) || '')
              .split('; ')
              .map((v) => v.split(/=(.*)/s).map(decodeURIComponent))
          );

          // console.log('Valores de accessToken:', accessTokenValues);

          const refreshTokenValues = Object.fromEntries(
            (headerCookies.find((c) => c.includes('refreshToken=')) || '')
              .split('; ')
              .map((v) => v.split(/=(.*)/s).map(decodeURIComponent))
          );

          cookies().set({
            name: 'accessToken',
            value: accessTokenValues.accessToken,
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === 'production',
            sameSite: 'strict',
            maxAge: accessTokenValues['Max-Age'],
            path: '/',
          });

          cookies().set({
            name: 'refreshToken',
            value: refreshTokenValues.refreshToken,
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === 'production',
            sameSite: 'strict',
            maxAge: refreshTokenValues['Max-Age'],
            path: '/',
          });

          const user = await res.json();
          console.log('Usuario autenticado:', user);
          return user;

        } catch (error) {
          console.error('Error al autenticar:', error);
          throw new Error('Error de autenticación');
        }
      },
    }),

    // Proveedor de autenticación con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Para Google, llamar al backend para crear/buscar usuario y obtener tokens
      if (account?.provider === 'google') {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: profile?.email,
              name: profile?.name,
            }),
          });

          if (!res.ok) return false;

          const data = await res.json();

          // Adjuntar datos del backend al objeto user para el callback jwt
          user.backendUser = data.user;
          user.backendToken = data.token;
          user.backendRefreshToken = data.refreshToken;

          // Guardar cookies de tokens
          const cookieStore = cookies();
          cookieStore.set({
            name: 'accessToken',
            value: data.token,
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === 'production',
            sameSite: 'strict',
            maxAge: data.tokenExpiresInSeg,
            path: '/',
          });
          cookieStore.set({
            name: 'refreshToken',
            value: data.refreshToken,
            httpOnly: true,
            secure: process.env.NEXT_PUBLIC_ENV === 'production',
            sameSite: 'strict',
            maxAge: data.refreshExpiresInSeg,
            path: '/',
          });

          return true;
        } catch (error) {
          console.error('Error en signIn con Google:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
          // Flujo Google: usar datos del backend adjuntados en signIn
          const userData = user.backendUser || {};
          token.accessToken = user.backendToken;
          token.refreshToken = user.backendRefreshToken;
          token.id = userData._id;
          token.role = userData.role;
          token.name =
            `${userData.firstname || ''} ${userData.lastname || ''}`.trim() ||
            userData.username ||
            '';
          token.image = userData.image || '';
          token.email = userData.email || '';

          try {
            const payload = JSON.parse(
              Buffer.from(user.backendToken.split('.')[1], 'base64url').toString()
            );
            token.apiTokenExpires = payload.exp * 1000;
          } catch {
            token.apiTokenExpires = Date.now() + 60 * 60 * 1000;
          }

          delete token.error;
        } else {
          // Flujo Credentials: estructura existente
          const userData = user.user || {};
          token.accessToken = user.token;
          token.refreshToken = user.refreshToken;
          token.id = userData._id;
          token.role = userData.role;
          token.name =
            `${userData.firstname || ''} ${userData.lastname || ''}`.trim() ||
            userData.username ||
            '';
          token.image = userData.image || '';
          token.email = userData.email || '';

          try {
            const payload = JSON.parse(
              Buffer.from(user.token.split('.')[1], 'base64url').toString()
            );
            token.apiTokenExpires = payload.exp * 1000;
          } catch {
            token.apiTokenExpires = Date.now() + 60 * 60 * 1000;
          }

          delete token.error;
        }
      }

      // Si el access token no ha expirado, devolverlo tal cual
      if (!token.apiTokenExpires || Date.now() < token.apiTokenExpires) {
        return token;
      }

      // Access token expirado: intentar renovarlo con el refresh token
      if (!token.refreshToken) {
        token.error = 'RefreshAccessTokenError';
        return token;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!response.ok) {
          token.error = 'RefreshAccessTokenError';
          return token;
        }

        const data = await response.json();

        token.accessToken = data.accessToken;
        token.refreshToken = data.refreshToken;

        try {
          const payload = JSON.parse(
            Buffer.from(data.accessToken.split('.')[1], 'base64url').toString()
          );
          token.apiTokenExpires = payload.exp * 1000;
        } catch {
          token.apiTokenExpires = Date.now() + 60 * 60 * 1000;
        }

        delete token.error;
      } catch {
        token.error = 'RefreshAccessTokenError';
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token;
      // Propagar el error de expiración para que el cliente pueda reaccionar
      if (token.error) session.error = token.error;
      return session;
    },
  },

  events: {
    async signOut() {
      cookies().delete('accessToken');
      cookies().delete('refreshToken');
    },
  },
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
