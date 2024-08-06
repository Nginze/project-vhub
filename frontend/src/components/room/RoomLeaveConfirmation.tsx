import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { RotatingLines } from "react-loader-spinner";
import { connect } from "http2";
import { WebSocketContext } from "@/context/WsContext";
import { userAgent } from "next/server";
import { userContext } from "@/context/UserContext";
import { useMediaStore } from "@/engine/rtc/store/MediaStore";

type RoomLeaveConfirmationProps = {};

export const RoomLeaveConfirmation: React.FC<
  RoomLeaveConfirmationProps
> = () => {
  const router = useRouter();
  const { id: roomId } = router.query;
  const [loading, setLoading] = React.useState(false);
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(userContext);
  const { mic, vid, screenMic, screenVid, nullify } = useMediaStore();

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
            mic?.stop();
            vid?.stop();
            screenMic?.stop();
            screenVid?.stop();
            nullify();
            await router.push("/home");

            conn?.emit("leave-room", { roomId, userId: user.userId });

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
