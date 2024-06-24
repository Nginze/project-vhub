import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";

type RoomLeaveConfirmationProps = {};

export const RoomLeaveConfirmation: React.FC<
  RoomLeaveConfirmationProps
> = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [loading, setLoading] = React.useState(false);
  return (
    <div className="font-logo">
      <div className="w-full flex flex-col items-start gap-2 mb-5">
        <span className="flex items-center gap-3 font-semibold text-2xl">
          Exiting Room
        </span>
        <span className="text-[14px] opacity-70">
          Are you sure you want to leave this room?
        </span>
      </div>
      <div>
        <Button
          onClick={async () => {
            setLoading(true);
            await router.push("/home");
            setLoading(false);
          }}
          className="flex items-center gap-2 py-6 w-full bg-appRed"
        >
          {loading ? (
            <>
              <RotatingLines
                width={"16"}
                animationDuration="0.75"
                strokeColor="grey"
                strokeWidth="5"
                visible={true}
              />
            </>
          ) : (
            "Leave Room"
          )}
        </Button>
      </div>
    </div>
  );
};
