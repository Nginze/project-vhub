import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  setOpenChange?: any;
  width?: any;
};

const AppDialog = ({
  children,
  content,
  defaultOpen,
  open,
  setOpenChange,
  width,
}: Props) => {
  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={setOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn("sm:max-w-[800px] bg-void", width)}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
