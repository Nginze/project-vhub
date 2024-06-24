import { Logo } from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { Grid } from "@/components/ui/grid";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AtSign } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import React from "react";
import { BsDiscord, BsGithub, BsTwitterX } from "react-icons/bs";

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
    <>
      <Grid />
      <div className="w-screen h-screen flex items-center justify-center bg-void text-white">
        <div className="flex flex-col w-[510px] items-center gap-5 relative rounded-lg bg-deep border border-[hsla(0,0%,100%,.1)] px-12 py-10">
          <div className="flex items-center justify-center">
            <img src="/login_infog.png" className="w-2/4" />
          </div>
          <div className="flex flex-col items-center gap-2 mb-2">
            <Logo withLogo size="md" />
            <span className="text-[12px]  opacity-50 w-full text-center">
              Sign-up with your Google account or with your Email address
            </span>
          </div>
          <Button
            onClick={() => googleLogin()}
            className="bg-white text-black w-full flex items-center gap-2 justify-center hover:text-white"
          >
            <Image src={"/Google.svg"} width={20} height={20} alt="google" />
            Continue with Google
          </Button>
          <div className="w-2/5 flex justify-center items-center gap-4">
            <Separator orientation="horizontal" className="bg-white" />
            <span className="text-sm font-semibold">OR</span>
            <Separator />
          </div>
          <div className="w-full flex flex-col items-center gap-6">
            <div className="relative w-full">
              <Input
                className="w-full bg-transparent py-6 text-[14px] border-[hsla(0,0%,100%,.1)] bg-dark placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
                placeholder="Enter your email address"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <AtSign />
              </div>
            </div>
            <Button
              onClick={() => googleLogin()}
              className="bg-[#43B581] text-white font-semibold w-full flex items-center py-6 gap-2 justify-center"
            >
              Sign-up with email
            </Button>
          </div>
          <div className="flex flex-row justify-center gap-6 mt-5 w-full">
            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <span>
                    <BsGithub size={20} />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Follow Github</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <span>
                    <BsDiscord size={20} />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Join Discord</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button>
                  <span>
                    <BsTwitterX size={20} />
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Follow X</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="text-[10.5px] opacity-50 w-[450px] text-center absolute bottom-12">
          By Joining Holoverse you agree to the Terms of Service and Privacy
          Policy, and confirm you are 18 and over
        </div>
      </div>
    </>
  );
};

export default Login;
