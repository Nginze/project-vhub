import React, { useContext, useEffect, useState } from "react";
import { Logo } from "../global/Logo";
import { Button } from "../ui/button";
import {
  Calendar,
  CalendarRange,
  Check,
  CircleHelp,
  CircleUser,
  Info,
  Plus,
  PlusCircle,
  PlusIcon,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import AppDialog from "../global/AppDialog";
import {
  CreateSpaceForm,
  CreateSpaceSelectMapTemplateForm,
} from "./HomeCreateSpace";
import { useCreateFormStore } from "@/global-store/CreateFormStore";
import { Sheet } from "../ui/sheet";
import { AppSheet } from "../global/AppSheet";
import { HomeProfileSheet } from "./HomeProfileSheet";
import { userContext } from "@/context/UserContext";
import { HiQuestionMarkCircle, HiSparkles } from "react-icons/hi2";
import { FaCalendarDays } from "react-icons/fa6";
import { AppCtxMenu } from "../global/AppCtxMenu";
import { HomeResourceMenu } from "./HomeResourceMenu";
import { AppDropDownMenu } from "../global/AppDropDownMenu";
import { cn, getSpritePreview } from "@/lib/utils";
import { useRouter } from "next/router";
import { get } from "http";
import { HomeCharacterCustomizer } from "./HomeCharacterCustomizer";
import { useUIStore } from "@/global-store/UIStore";
import Loader from "../global/Loader";

type HomeNavProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const HomeNav: React.FC<HomeNavProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { set, selectFormOpen, createFormOpen } = useCreateFormStore();
  const { user } = useContext(userContext);
  const [spritePreviewUrl, setSpritePreviewUrl] = useState<string>("");
  const router = useRouter();
  const { set: setUI, sheetOpen } = useUIStore();

  useEffect(() => {
    console.log(spritePreviewUrl);
    getSpritePreview(3, user).then((previewUrl) =>
      setSpritePreviewUrl(previewUrl as string)
    );
  }, [user, router]);

  return (
    <>
      <div className="flex justify-between items-center border-b border-light/50 py-5 sticky top-0 bg-void z-50">
        <div className="flex items-center gap-5">
          <div onClick={() => router.push("/home")}>
            <Logo withLogo={true} withText={false} size="md" />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("events")}
              className={cn(
                "flex gap-2 items-center px-5 button p-3 hover:bg-light active:bg-deep rounded-xl font-semibold transform transition-transform duration-150",
                activeTab === "events" && `bg-light active:scale-90`
              )}
            >
              <FaCalendarDays size={16} />
              Events
            </button>
            <button
              onClick={() => setActiveTab("spaces")}
              className={cn(
                "flex gap-2 items-center px-5 p-3 button hover:bg-light active:bg-deep rounded-xl font-semibold transform transition-transform duration-150",
                activeTab === "spaces" && `bg-light active:scale-90`
              )}
            >
              <HiSparkles />
              Spaces
            </button>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <AppDialog
            width={"sm:max-w-[450px]"}
            className="p-0"
            content={<HomeCharacterCustomizer />}
          >
            <div className="relative sparkle-container">
              <button className="w-10 h-10 bg-appYellow hover:opacity-55 transition-opacity relative border rounded-full border-light overflow-hidden flex items-center justify-center">
                {spritePreviewUrl ? (
                  <img
                    src={spritePreviewUrl}
                    className="w-14 h-14 object-contain transform scale-110 "
                  />
                ) : null}
              </button>

              <div className="bg-blue-400 p-0.5 border border-light absolute bottom-0 -right-1 rounded-full">
                <Check size={10} />
              </div>
            </div>
          </AppDialog>
          <AppDropDownMenu
            className="bg-dark border border-light text-white w-[190px] rounded-xl"
            content={<HomeResourceMenu />}
          >
            <button className="flex gap-2 items-center px-5 p-3 active:bg-deep hover:bg-light rounded-xl font-semibold">
              <HiQuestionMarkCircle size={26} />
              Resources
            </button>
          </AppDropDownMenu>
          <AppDialog
            onClose={() => set({ selectFormOpen: false })}
            open={selectFormOpen && !createFormOpen}
            content={<CreateSpaceSelectMapTemplateForm />}
          >
            <Button
              onClick={() => set({ selectFormOpen: true })}
              className="flex items-center gap-2 py-6 button bg-appPrimary rounded-xl"
            >
              <PlusCircle size={18} />
              <span className="font-semibold">Create Space</span>
            </Button>
          </AppDialog>
          <AppSheet
            className="w-[500px] p-0"
            open={sheetOpen}
            onOpenChange={(open: boolean) => setUI({ sheetOpen: !sheetOpen })}
            content={
              <HomeProfileSheet
              // setSheetOpen={(open: boolean) => setUI({ sheetOpen: false })}
              />
            }
          >
            <Avatar className="w-8 h-8 cursor-pointer ring hover:opacity-80">
              <AvatarImage
                className="object-cover"
                src={user?.avatarUrl as string}
              />
              <AvatarFallback />
            </Avatar>
          </AppSheet>
        </div>
      </div>

      <AppDialog
        open={!selectFormOpen && createFormOpen}
        onClose={() => set({ createFormOpen: false })}
        width={"sm:max-w-[500px]"}
        content={<CreateSpaceForm />}
      >
        <></>
      </AppDialog>
    </>
  );
};
