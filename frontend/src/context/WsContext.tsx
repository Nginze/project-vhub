import { useRendererStore } from "@/store/RendererStore";
import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ManagerOptions, Socket, SocketOptions, io } from "socket.io-client";

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
  // const { user, userLoading } = useContext(userContext);
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

  // useEffect(() => {
  //   // console.log(user, userLoading);
  //   if (!userLoading && pathname !== "/login" && (!user || !user.userId)) {
  //     // toast("login to use streams");
  //     router.push("/login");
  //   }
  // }, [userLoading, pathname, user]);

  return (
    <WebSocketContext.Provider value={{ conn: conn }}>
      {children}
    </WebSocketContext.Provider>
  );
};
