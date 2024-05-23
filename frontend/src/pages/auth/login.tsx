import { Logo } from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import Image from "next/image";
import React from "react";

const POP_UP_WIDTH = 400;
const POP_UP_HEIGHT = 500;

const Login: NextPage = () => {
  const left =
    typeof window !== "undefined" && window.innerWidth / 2 - POP_UP_WIDTH / 2;
  const top =
    typeof window !== "undefined" && window.innerHeight / 2 - POP_UP_HEIGHT / 2;

  const googleLogin = () => {
    window.open(
      `${
        process.env.NODE_ENV == "production"
          ? `${process.env.NEXT_PUBLIC_PROD_API}/auth/google`
          : `${process.env.NEXT_PUBLIC_DEV_API}/auth/google`
      }`,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
  scrollbars=no, resizable=no, copyhistory=no, width=${POP_UP_WIDTH}, 
  height=${POP_UP_HEIGHT}, top=${top}, left=${left}`
    );
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#202225]">
      <div className="flex flex-col items-center gap-5 relative">
        <div className="flex flex-col items-center gap-5">
          <Logo withLogo size="md" />
          <span className="text-sm opacity-50 w-3/4 text-center">
            Sign-up with your google account or email address to experience the
            Holoverse
          </span>
        </div>
        <Button
          onClick={() => googleLogin()}
          className="bg-white text-black w-full flex items-center gap-2 justify-center hover:text-white"
        >
          <Image src={"/Google.svg"} width={20} height={20} alt="google" />
          Continue with Google
        </Button>
        <span>OR</span>
        <div className="w-full flex flex-col items-center gap-5">
          <Input
            className="w-full bg-transparent py-6 border-[#7289DA] outline-none text-white"
            placeholder="Enter your email address"
          />
          <Button
            onClick={() => googleLogin()}
            className="bg-[#43B581] text-white w-full flex items-center gap-2 justify-center"
          >
            Sign-up with email
          </Button>
        </div>
      </div>

      <div className="text-sm opacity-50 w-[500px] text-center absolute bottom-5">
        By Joining Holoverse you agree to the Terms of Service and Privacy
        Policy, and confirm you are 18 and over
      </div>
    </div>
  );
};

export default Login;
