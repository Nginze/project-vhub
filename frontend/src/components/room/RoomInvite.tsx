import React, { useState } from "react";
import { Button } from "../ui/button";
import { CheckCheck, Link, Share, Share2 } from "lucide-react";
import { useRouter } from "next/router";

type RoomInviteProps = {};

export const RoomInvite: React.FC<RoomInviteProps> = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [buttonText, setButtonText] = useState("Copy Link");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleCopyLink = async () => {
    const link = `${
      process.env.NODE_ENV == "development"
        ? process.env.NEXT_PUBLIC_DEV_URL
        : process.env.NEXT_PUBLIC_PROD_URL
    }/room/${roomId}`;
    await navigator.clipboard.writeText(link);
    setButtonText("Link Copied!");
    setButtonDisabled(true);
    setTimeout(() => {
      setButtonText("Copy Link");
      setButtonDisabled(false);
    }, 1000);
  };

  return (
    <div className="font-logo">
      <div className="w-full flex flex-col items-start gap-2 mb-5">
        <span className="flex items-center gap-3 font-semibold text-2xl">
          Share this link 🎉
        </span>
        <span className="text-[14px] opacity-70">
          Try inviting some of your favourite buddies to come hangout
        </span>
      </div>
      <div>
        <Button
          onClick={handleCopyLink}
          disabled={buttonDisabled}
          className="flex items-center gap-2 py-6 w-full bg-appGreen"
        >
          {buttonDisabled ? <CheckCheck /> : <Link />}
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
