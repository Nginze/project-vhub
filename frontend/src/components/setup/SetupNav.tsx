import { Logo } from "@/components/global/Logo";
import { userContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import React, { useContext } from "react";

type SetupNavProps = {};

export const SetupNav: React.FC<SetupNavProps> = () => {
  const { user } = useContext(userContext);
  const router = useRouter();

  return (
    <div className="flex justify-between items-center">
      <div onClick={() => router.push("/home")}>
        <Logo withLogo={true} size="md" />
      </div>
      <span className="opacity-40 text-[14px] cursor-pointer">
        {user?.email}
      </span>
    </div>
  );
};
