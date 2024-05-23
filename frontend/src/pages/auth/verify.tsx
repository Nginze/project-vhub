import { Logo } from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { NextPage } from "next";
import React from "react";

const Verify: NextPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#202225]">
      <div className="flex flex-col items-center gap-4 relative">
        <div className="flex flex-col items-center gap-4">
          <Logo withLogo size="md" />
          <span className="text-sm opacity-50 w-3/4 text-center">
            Verify your Email Address{" "}
          </span>
          <span className="text-sm opacity-50 font-semibold w-3/5 text-center">
            We just emailed{" "}
            <span className="text-green-400 cursor-pointer font-medium">
              jack@gmail.com
            </span>{" "}
            with a magic link to be verified. If you have verified click the
            button to continue 🎉

          </span>
        </div>
        <Button className="bg-white text-black w-4/5 flex items-center gap-2 justify-center hover:text-white">
          <MailCheck />
          Confirm Email Verification
        </Button>
      </div>

      <div className="text-sm opacity-50 w-[500px] text-center absolute bottom-5">
        By Joining Holoverse you agree to the Terms of Service and Privacy
        Policy, and convfirm you are 18 and over
      </div>
    </div>
  );
};

export default Verify;
