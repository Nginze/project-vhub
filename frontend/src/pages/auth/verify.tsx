import { Logo } from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { NextPage } from "next";
import Head from "next/head";
import React from "react";

const Verify: NextPage = () => {
  return (
    <>
      <Head>
        <title>Holoverse | Better Spaces for Online Events </title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </Head>

      <div className="w-screen h-screen flex items-center justify-center bg-[#202225]">
        <div className="flex flex-col items-center gap-6 relative">
          <div className="flex flex-col items-center gap-4">
            <Logo withLogo size="md" />
            <span className="text-sm opacity-50 font-semibold w-3/5 text-center">
              We just emailed{" "}
              <span className="text-green-400 cursor-pointer font-medium">
                jack@gmail.com
              </span>{" "}
              with a magic link to be verified. If you have verified click the
              button to continue 🎉
            </span>
          </div>
          <Button className="bg-white text-black w-4/6 flex items-center gap-2 justify-center hover:text-white">
            <MailCheck size={20} />
            Confirm Email Verification
          </Button>
        </div>

        <div className="text-[10.5px] opacity-50 w-[500px] text-center absolute bottom-6">
          By Joining Holoverse you agree to the Terms of Service and Privacy
          Policy, and convfirm you are 18 and over
        </div>
      </div>
    </>
  );
};

export default Verify;
