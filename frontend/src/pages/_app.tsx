import { WebSocketProvider } from "@/context/WsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useState } from "react";
import "@/styles/globals.css";
import { MainWsHandler } from "@/engine/global/MainWsHandler";
import { Lexend_Deca, Inter } from "next/font/google";
import UserProvider from "@/context/UserContext";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  variable: "--font-lexend-deca",
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <style jsx global>{`
        overflow-hidden
        ${lexendDeca.variable}
        font-body
        text-white
      `}</style>

      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <WebSocketProvider>
              <MainWsHandler>
                <Component {...pageProps} />;
              </MainWsHandler>
            </WebSocketProvider>
          </UserProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
