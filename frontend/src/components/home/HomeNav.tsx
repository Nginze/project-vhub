import React, { useContext, useState } from "react";
import { Logo } from "../global/Logo";
import { Button } from "../ui/button";
import {
  Calendar,
  CalendarRange,
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
import { cn } from "@/lib/utils";

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
  const [sheetOpen, setSheetOpen] = useState(false);
  return (
    <>
      <div className="flex justify-between items-center border-b border-light/50 pb-5">
        <div className="flex items-center gap-5">
          <Logo withLogo={true} withText={false} size="lg" />
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
          <AppDropDownMenu content={<HomeResourceMenu />}>
            <button className="flex gap-2 items-center button px-5 p-3 active:bg-deep hover:bg-light rounded-xl font-semibold">
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
              className="flex items-center gap-2 py-6 button bg-appGreen rounded-xl"
            >
              <PlusCircle size={18} />
              <span className="font-semibold">Create Space</span>
            </Button>
          </AppDialog>
          <AppSheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            content={<HomeProfileSheet setSheetOpen={setSheetOpen} />}
          >
            <Avatar className="w-8 h-8 cursor-pointer ring ">
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
