"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

/**
 * Detecta cuando el token de la API expira y cierra la sesión automáticamente.
 * Debe montarse dentro de SessionProvider (ya incluido en Providers).
 */
export function SessionGuard() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "AccessTokenExpired") {
      signOut({ callbackUrl: "/" });
    }
  }, [session]);

  return null;
}
