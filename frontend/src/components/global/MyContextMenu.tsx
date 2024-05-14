import React from "react";
import {
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenu,
} from "../ui/context-menu";

type MyContextMenuProps = {};

export const MyContextMenu: React.FC<MyContextMenuProps> = () => {
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div id="ctx-menu-trigger"></div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Billing</ContextMenuItem>
          <ContextMenuItem>Team</ContextMenuItem>
          <ContextMenuItem>Subscription</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
};
