import { SetupForm } from "@/components/setup/SetupForm";
import { SetupNav } from "@/components/setup/SetupNav";
import { SetupPreview } from "@/components/setup/SetupPreview";
import { NextPage } from "next";
import React from "react";

const Setup: NextPage = () => {

  
  return (
    <main className="w-screen h-screen flex justify-center font-logo bg-[#202225]">
      <div className="w-4/5 h-full flex flex-col px-2 py-2 gap-44">
        <div className="w-full mt-10">
          <SetupNav />
        </div>
        <div className="w-full h-full flex justify-center ">
          <div className="flex flex-col gap-8 w-1/2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[25px] font-body">
                Welcome to the <span>Groovy Community</span>
              </span>
              <span className="w-1/2 text-center opacity-40 text-[12px]">
                We need your permission to access your microphone and camera so
                others can hear you
              </span>
            </div>
            <div className="flex items-start gap-10">
              <SetupPreview />
              <SetupForm />
            </div>
          </div>
        </div>
      </div>
      <span className="text-[12px] opacity-40 w-[500px] text-center absolute bottom-5">
        By Joining Holoverse you agree to the Terms of Service and Privacy
        Policy, and confirm you are 18 and over
      </span>
    </main>
  );
};

export default Setup;
