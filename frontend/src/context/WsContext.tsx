import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";
import { userContext } from "./UserContext";
import Head from "next/head";
import { VscDebugDisconnect } from "react-icons/vsc";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

interface WsContext {
  conn: Socket | undefined;
}

export const WebSocketContext = createContext<WsContext>({} as WsContext);

export const WebSocketProvider = ({ children }: Props) => {
  const opts = {
    transports: ["polling"],
    reconnectionAttempts: 5,
    withCredentials: true,
  } as Partial<ManagerOptions & SocketOptions>;

  const router = useRouter();
  const { user, userLoading } = useContext(userContext);
  const { set } = useRendererStore();
  const { pathname } = useRouter();
  const [conn, setConn] = useState<Socket | undefined>(undefined);
  const [isConnected, setConneted] = useState<boolean>(false);

  useEffect(() => {
    const ws = io(
      process.env.NODE_ENV == "production"
        ? (process.env.NEXT_PUBLIC_PROD_API as string)
        : (process.env.NEXT_PUBLIC_DEV_API as string),
      opts
    );
    ws.on("connect", () => {
      setConn(ws);
      set({ conn: ws }); // renderer store
      setConneted(true);
    });

    return () => {
      ws.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ conn: conn }}>
      {children}
    </WebSocketContext.Provider>
  );
};
