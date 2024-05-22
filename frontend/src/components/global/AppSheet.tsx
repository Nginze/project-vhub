import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

type AppSheetProps = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export const AppSheet: React.FC<AppSheetProps> = ({ children, content }) => {
  return (
    <>
      <Sheet>
        <SheetTrigger>{children}</SheetTrigger>
        <SheetContent>{content}</SheetContent>
      </Sheet>
    </>
  );
};
