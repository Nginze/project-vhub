import React from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  setOpenChange?: any;
  width?: any;
  height?: string;
  className?: string;
  onClose?: () => void;
};

const AppDialog = ({
  children,
  content,
  defaultOpen,
  open,
  setOpenChange,
  width,
  height,
  onClose,
  className,
}: Props) => {
  return (
    <Dialog defaultOpen={defaultOpen} open={open} onOpenChange={setOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={cn("sm:max-w-[800px] bg-void", width, height, className)}
      >
        <DialogPrimitive.Close
          onClick={onClose}
          className="absolute z-50 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
