import React from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "../ui/context-menu";

type AppCtxMenuProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export const AppCtxMenu: React.FC<AppCtxMenuProps> = ({
  children,
  content,
}) => {
  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">{content}</ContextMenuContent>
      </ContextMenu>
    </>
  );
};
