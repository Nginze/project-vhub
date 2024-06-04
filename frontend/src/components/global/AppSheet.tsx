import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

type AppSheetProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
};

export const AppSheet: React.FC<AppSheetProps> = ({
  children,
  content,
  title,
}) => {
  return (
    <>
      <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent className="bg-[#202225] text-white">
          {content}
        </SheetContent>
      </Sheet>
    </>
  );
};
