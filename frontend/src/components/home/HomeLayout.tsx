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
    <main className="w-11/12 h-auto flex flex-col gap-10">
      <div className="py-5">{navbar}</div>
      <div>{optionbar}</div>
      <div>{content}</div>
    </main>
  );
};
