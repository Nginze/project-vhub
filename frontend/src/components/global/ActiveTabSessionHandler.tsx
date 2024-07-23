import { useEffect, useState } from "react";
import { Grid } from "../ui/grid";
import Loader from "./Loader";
import {
  getCameras,
  getMicrophones,
  getSpeakers,
  useSettingStore,
} from "@/global-store/SettingStore";
import AppDialog from "./AppDialog";
import { HomeDeviceIssue } from "../home/HomeDeviceIssue";
import { Logo } from "./Logo";
import { AlertCircle } from "lucide-react";

const generateSessionId = () => {
  return Math.random().toString(36).substr(2, 9);
};

type ActiveTabSessionHandlerProps = {
  children: React.ReactNode;
};

export const ActiveTabSessionHandler = ({
  children,
}: ActiveTabSessionHandlerProps) => {
  const [isActiveSession, setIsActiveSession] = useState(true);
  const { set: setSettings } = useSettingStore();

  useEffect(() => {
    const sessionId = generateSessionId();
    window.localStorage.setItem("session", sessionId);

    window.addEventListener("storage", () => {
      const currentSession = window.localStorage.getItem("session");
      if (currentSession !== sessionId) {
        setIsActiveSession(false);
      } else {
        setIsActiveSession(true);
      }
    });

    window.addEventListener("beforeunload", () => {
      const currentSession = window.localStorage.getItem("session");
      if (currentSession === sessionId) {
        window.localStorage.removeItem("session");
      }
    });
  }, []);

  useEffect(() => {
    (async () => {

      try {
        const microphones = await getMicrophones();
        setSettings({ hasMicIssue: false });
      } catch (error) {
        setSettings({ hasMicIssue: true });
      }

      try {
        const cameras = await getCameras();
        setSettings({ hasCameraIssue: false });
      } catch (error) {
        setSettings({ hasCameraIssue: true });
      }

      try {
        const speakers = await getSpeakers();
        setSettings({ hasSpeakerIssue: false });
      } catch (error) {
        setSettings({ hasSpeakerIssue: true });
      }
    })();
  }, []);

  if (!isActiveSession) {
    return (
      <div className="bg-void text-white w-screen h-screen flex items-center justify-center">
        <Grid />

        <AppDialog
          open={true}
          width={"sm:max-w-[400px] p-0 border border-light"}
          dontShowClose
          content={<TabIssue />}
        >
          <></>
        </AppDialog>
      </div>
    );
  }

  return children;
};

const TabIssue: React.FC = () => {
  return (
    <div className="overflow-hidden w-full h-full rounded-lg font-sans">
      <div className="w-full relative">
        <img
          className="w-full object-cover h-28"
          src={"/gradient_bg4.webp"}
          alt=""
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Logo size="lg" withLogo={false} />
        </div>
      </div>
      <div className="p-4">
        <span className="text-[18px] font-semibold flex items-center gap-2 mb-1">
          Whoops!
          <AlertCircle size={15} className="inline-block" />
        </span>
        <div className="text-[13px] opacity-50 mb-3">
          We have detected multiple tabs running. You can only use one active
          tab at a time
        </div>
      </div>
    </div>
  );
};
