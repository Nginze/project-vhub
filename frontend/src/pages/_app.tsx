import { WebSocketProvider } from "@/context/WsContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import { useState } from "react";
import "@/styles/globals.css";
import { MainWsHandler } from "@/engine/global/MainWsHandler";
import UserProvider from "@/context/UserContext";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import WebrtcApp from "@/engine/rtc/WebRTCApp";
import SoundEffectPlayer from "@/engine/global/SoundFxPlayer";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { KeyBindHandler } from "@/engine/global/KeyBindHandler";
import { ActiveTabSessionHandler } from "@/components/global/ActiveTabSessionHandler";
import { ChatWsHandler } from "@/engine/global/ChatWsHandler";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <WebSocketProvider>
              <MainWsHandler>
                <NextNProgress />
                <ActiveTabSessionHandler>
                  <Component {...pageProps} />;
                </ActiveTabSessionHandler>
              </MainWsHandler>
              <ChatWsHandler />
              <SoundEffectPlayer />
              <KeyBindHandler />
              <WebrtcApp />
              <Toaster position="bottom-center" reverseOrder={false} />
            </WebSocketProvider>
          </UserProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}
