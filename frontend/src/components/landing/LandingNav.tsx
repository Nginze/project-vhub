import React from "react";
import { Logo } from "../global/Logo";
import { AppDropDownMenu } from "../global/AppDropDownMenu";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { HomeResourceMenu } from "../home/HomeResourceMenu";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

type LandingNavProps = {};

export const LandingNav: React.FC<LandingNavProps> = () => {
  const router = useRouter();

  return (
    <nav className="flex w-screen px-32 z-10 py-12 h-16 items-center">
      <div className="w-full flex justify-between items-center">
        <span
          onClick={async () => {
            await router.push("/");
          }}
        >
          <Logo withLogo={true} withText={true} size="lg" />
        </span>
        <div className="flex gap-4">
          <div className="flex items-center gap-6">
            <Button
              onClick={async () => {
                await router.push("/auth/login");
              }}
              className="flex items-center gap-2 py-5 w-[100px] cursor-pointer bg-dark border border-veryLight rounded-xl"
            >
              <span className="font-semibold"> Sign In</span>
            </Button>
            <Button
              onClick={async () => {
                await router.push("/home");
              }}
              className="flex items-center gap-2 py-5 w-[150px] hover:bg-white/70 active:ring active:ring-appPrimary cursor-pointer bg-white text-black border border-veryLight rounded-xl"
            >
              <span className="font-semibold"> ✨ Try Holo free</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
