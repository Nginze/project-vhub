import React from "react";
import keys from "@reaviz/ctrl-keys";

type KeyBindHandlerProps = {};

export const KeyBindHandler: React.FC<KeyBindHandlerProps> = () => {
  const handler = keys();

  React.useEffect(() => {
    return () => {
      window.addEventListener("keydown", handler.handle);
    };
  }, []);

  return null;
};
