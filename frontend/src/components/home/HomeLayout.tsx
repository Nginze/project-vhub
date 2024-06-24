import React from "react";

type HomeLayoutProps = {
  navbar: React.ReactNode;
  optionbar: React.ReactNode;
  content: React.ReactNode;
};

export const HomeLayout: React.FC<HomeLayoutProps> = ({
  navbar,
  optionbar,
  content,
}) => {
  return (
    <main className="w-11/12 h-screen flex flex-col gap-6">
      <div>{navbar}</div>
      <div>{optionbar}</div>
      <div>{content}</div>
    </main>
  );
};
