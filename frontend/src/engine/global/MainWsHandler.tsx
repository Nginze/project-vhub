import { WebSocketContext } from "@/context/WsContext";
import React, { useContext, useEffect } from "react";

type MainWsHandlerProps = {
  children: React.ReactNode;
};

export const MainWsHandler: React.FC<MainWsHandlerProps> = ({ children }) => {
  const { conn } = useContext(WebSocketContext);

  useEffect(() => {
    if (!conn) {
      return;
    }

    return () => {
      conn.off("you-joined-room");
      conn.off("new-participant");
    };
  }, [conn]);

  return <>{children}</>;
};
