import { NextResponse } from "next/server";
import { serverSideVerify } from "./services/auth";
import { isDynamicIdPath } from "./utils/helpers";
import roles from "./utils/roles";
import { cookies } from 'next/headers';
import {
  signRoutes,
  adminRoutes,
  professionalRoutes,
  publicRoutes,
  userRoutes,
  superAdminRoutes,
} from "./utils/routes";
import { GiConsoleController } from "react-icons/gi";

const roleRoutes = {
  [roles.USER]: userRoutes,
  [roles.PROFESSIONAL]: professionalRoutes,
  [roles.ADMIN]: adminRoutes,
  [roles.SUPER_ADMIN]: superAdminRoutes,
};

const refreshAccessToken = async(refreshToken) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Cookie': `refreshToken=${refreshToken}`, 
      },
    });
   
    if (!response.ok) {
      return res.status(401).json({ message: 'No se pudo refrescar el token' });
    }
    const res = await response.json()
    return res;
  } catch (error) {
    console.error("Error al refrescar el token:", error);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const token = cookies().get("accessToken")?.value;
  const refresh = cookies().get("refreshToken")?.value;

  if (publicRoutes.includes(pathname) || isDynamicIdPath(pathname)) {
    return NextResponse.next();
  }

  let user;

  try {

    if (!token && !refresh) {
      // Limpiar las cookies
      const res = NextResponse.redirect(new URL('/login', request.url)); // Redirige al login

      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        // Parsear las cookies
        const cookiesArray = cookieHeader.split(';');
        
        cookiesArray.forEach(cookie => {
          const cookieName = cookie.split('=')[0].trim();

          // Eliminar la cookie configurando su maxAge a 0
          res.cookies.set(cookieName, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, 
            path: '/',
          });
        });
      }

      return res;
    }
    
    if (token){
      user = await serverSideVerify(token);
    }else if(refresh){
      const { accessToken, refreshToken, tokenExpiresInSeg, refreshExpiresInSeg } = await refreshAccessToken(refresh)
      user = await serverSideVerify(accessToken);
       
       const res = NextResponse.next();

       res.cookies.set('accessToken', accessToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: tokenExpiresInSeg, 
         path: '/',
       });
 
       res.cookies.set('refreshToken', refreshToken, {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         maxAge: refreshExpiresInSeg, 
       });
       console.log("probando un nuevo res")
       return res;
    }else{
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    
    if (signRoutes.includes(pathname)) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    
    if (roleRoutes[user.role].includes(pathname)) {
      return NextResponse.next();
    }

  } catch (error) {
    console.error(error)
    
  }
}

export const config = {
  matcher: ["/user/:path*"],
};
