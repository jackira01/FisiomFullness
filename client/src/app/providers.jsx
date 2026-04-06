"use client";

import { SocketProvider } from "@/features/socket";
import { NextUIProvider } from "@nextui-org/system";
import { Provider as JotaiProvider } from "jotai";
import { SessionProvider } from "next-auth/react";
import { SessionGuard } from "@/components/SessionGuard";

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <SessionProvider>
        <JotaiProvider>
          <SessionGuard />
          <SocketProvider>{children}</SocketProvider>
        </JotaiProvider>
      </SessionProvider>
    </NextUIProvider>
  );
}
