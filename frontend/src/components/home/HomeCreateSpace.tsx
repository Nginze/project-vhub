import React, { useContext, useState } from "react";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { CircleCheckBig, ShieldCheck } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import App from "@/pages/_app";
import AppDialog from "../global/AppDialog";
import { useCreateFormStore } from "@/global-store/CreateFormStore";
import { appToast, cn } from "@/lib/utils";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Logo } from "../global/Logo";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import { userContext } from "@/context/UserContext";
import { useUIStore } from "@/global-store/UIStore";
import toast from "react-hot-toast";
import { LoaderOverlay } from "../global/LoaderOverlay";
import { WS_MESSAGE } from "@/engine/2d-renderer/events";
import { WebSocketContext } from "@/context/WsContext";
import Loader from "../global/Loader";

export const CreateSpaceForm: React.FC = () => {
  const { set, createFormOpen } = useCreateFormStore();
  const [spacePrivacy, setSpacePrivacy] = useState("");
  const { user } = useContext(userContext);
  const {
    spaceName,
    spaceDescription,
    passcode,
    mapKey,
    privacy,
    roomSize,
    set: setUI,
  } = useUIStore();
  const [roomCreated, setRoomCreated] = useState(false);
  const { conn } = useContext(WebSocketContext);

  const createSpaceMutation = useMutation({
    mutationFn: async (data: {
      roomName: string;
      roomDesc: string;
      creatorId: string;
      isPrivate: boolean;
      autoSpeaker: boolean;
      chatEnabled: boolean;
      handRaiseEnabled: boolean;
      mapKey: string;
      privacy: string;
      passcode: string;
      roomSize: number;
    }) => {
      console.log(data);
      try {
        const { data: res } = await api.post("/room/create", data);
        return res;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess(data, variables, context) {
      appToast("Space Created", null, "bottom-center");
      setRoomCreated(true);
      conn?.emit(WS_MESSAGE.RTC_WS_CREATE_ROOM, { roomId: data.roomId });
    },

    onError(error, variables, context) {
      appToast("Couldn't create space", null, "bottom-center");
    },
  });

  return (
    <>
      <div className="flex flex-col gap-5 font-sans">
        <div className="w-full flex flex-col items-center  gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="mb-3 p-4 border border-light bg-ultra rounded-xl">
              <Logo withLogo withText={false} size="md" />
            </span>
            <span className="text-[23px] font-sans font-semibold ">
              Set up the basics
            </span>
            <span className="text-[14px] opacity-50 w-3/4  text-center font-sans">
              Let's create something awesome! Provide the details for your new
              space. ✨
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 px-2">
          <div>
            <div className="flex flex-col items-start w-full">
              <span className="text-[14px] opacity-50 text-center font-sans">
                What is your space name?
              </span>
            </div>
            <Input
              value={spaceName}
              onChange={(e) => {
                setUI({ spaceName: e.target.value });
              }}
              className="w-full mt-2 rounded-xl py-6 text-[14px] border-[hsla(0,0%,100%,.1)] bg-void placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
              placeholder="Space name ex: My Office, Team Space"
            />
          </div>

          <div>
            <span className="text-[14px] opacity-50 w-3/4  text-center font-sans">
              Brief description of your space
            </span>
            <Input
              value={spaceDescription}
              onChange={(e) => {
                setUI({ spaceDescription: e.target.value });
              }}
              className="w-full rounded-xl py-6 text-[14px] mt-2 border-[hsla(0,0%,100%,.1)] bg-void placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
              placeholder="Tell us more about your space"
            />
          </div>
          <div className="w-full">
            <span className="text-[14px] opacity-50 w-3/4  text-center font-sans">
              Set your space privacy
            </span>
            <Select
              onValueChange={(value) => {
                setSpacePrivacy(value);
                setUI({ privacy: value });
              }}
            >
              <SelectTrigger className=" bg-deep py-6 mt-2 hover:bg-deep border-none ring-0 outline-none focus:outline-none focus:ring-0 rounded-xl border border-light">
                <SelectValue
                  placeholder={
                    <span className="flex items-center gap-2">
                      <span className="text-[14px] opacity-70">
                        Anyone with url can enter space{" "}
                      </span>
                    </span>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  Anyone with url can enter space{" "}
                </SelectItem>
                <SelectItem value="private">Anyone with passcode</SelectItem>
              </SelectContent>
            </Select>

            {spacePrivacy == "private" && (
              <div>
                <Input
                  value={passcode}
                  onChange={(e) => {
                    setUI({ passcode: e.target.value });
                  }}
                  className="w-1/4 mt-5 rounded-xl py-6 text-[14px] border-[hsla(0,0%,100%,.1)] bg-semiUltra placeholder:text-white placeholder:opacity-60 outline-none text-white pl-3 pr-10"
                  placeholder="pass ***"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between items-center px-2">
          <Button
            onClick={() => {
              set({
                createFormOpen: false,
                selectFormOpen: true,
                selectedMapTemplate: false,
              });
            }}
            className="bg-dark/80 gap-2 flex items-center px-4 py-6 rounded-lg"
          >
            Back
          </Button>
          <Button
            onClick={() => {
              createSpaceMutation.mutateAsync({
                autoSpeaker: true,
                chatEnabled: true,
                creatorId: user.userId as string,
                handRaiseEnabled: true,
                mapKey: mapKey,
                passcode: passcode,
                roomSize: roomSize,
                isPrivate: privacy === "private",
                privacy: privacy,
                roomDesc: spaceDescription,
                roomName: spaceName,
              });
            }}
            disabled={createSpaceMutation.isPending}
            className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg w-[130px]"
          >
            {
              createSpaceMutation.isPending ? <Loader alt width={15}/> : "Create Space"
            }
          </Button>
        </div>
      </div>

      {roomCreated && <LoaderOverlay />}
    </>
  );
};

// export const CreateSpaceSelectTypeForm: React.FC = () => {
//   return <div></div>;
// };

// export const CreateSpaceOnboardForm: React.FC = () => {
//   return <div></div>;
// };

export const CreateSpaceSelectMapTemplateForm: React.FC = () => {
  const { set, createFormOpen } = useCreateFormStore();
  const [activeTemplate, setActiveTemplate] = React.useState<number>(0);
  const {
    spaceName,
    roomSize,
    mapKey,
    spaceDescription,
    passcode,
    set: setUI,
  } = useUIStore();

  const mapPreviewUrls = [
    "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/64227fe0e5a9508a9d3dd776_63f641a08bd4e73c4dcd696c_HZjnT47ZY_6Og4nGcHPwImF_AUxO05SEnctd28WYN8xEeqNZDnGXu82XAW3xvHxRRqO3SBOWrMZ1zbYkfblwS1mqJ8RsRHRJmgzoQGReCrNnvkPK6DBuprG21dyyqNBu7KGxbixWAuGkFd0VyDboWAY.png",
    "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/640fa12e4bddf578ebe5c70a_officecozy%201.png",
    "https://cdn.prod.website-files.com/640f99c52b298c7753381c38/640fa090d9088df6de9cd07a_officecourtyard%201.png",
    "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/remote-work-events%2Fuse-cases-covers%2Fconference.png?alt=media&token=fb7a8707-51b2-483c-9753-d7b3ec5bee86",
  ];

  return (
    <div className={cn("w-full flex flex-col gap-6")}>
      <div className="flex items-end gap-7">
        <div className="flex flex-col items-start w-3/5">
          <span className="text-[24px] font-sans">Choose your Theme</span>
          <span className="text-[14px] opacity-45 mb-3">
            Select the size and theme of your office. You can change this later!
          </span>
          <div className="flex-grow min-h-72 h-72 w-full bg-dark rounded-2xl cursor-pointer overflow-hidden">
            <img
              src={mapPreviewUrls[activeTemplate]}
              className="w-full h-full object-cover border-2 border-light"
            />
          </div>
        </div>
        <div className="w-2/5">
          <div className="flex flex-col items-start">
            <span className="text-[18px]">Room Size</span>
            <span className="opacity-50 text-[12px]">
              Select a map size (25-30)
            </span>
            <Slider
              value={roomSize}
              onChange={(e, v) => {
                setUI({ roomSize: Number(v) });
              }}
              aria-label="Size"
              valueLabelDisplay="auto"
              defaultValue={10}
              step={5}
              marks
              min={10}
              max={30}
            />
          </div>
          <span className="text-[18px]">Map Theme</span>
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <Button
              onClick={() => setActiveTemplate(0)}
              className={`flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-xl border-2 ${
                activeTemplate === 0 ? "border-appGreen" : "border-transparent"
              }`}
            >
              <span>🚀</span>
              <span>Startup</span>
            </Button>
            <Button
              onClick={() => setActiveTemplate(1)}
              className={`flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-xl border-2 ${
                activeTemplate === 1 ? "border-appGreen" : "border-transparent"
              }`}
            >
              <span>🌳</span>
              <span>Outdoors</span>
            </Button>
            <Button
              onClick={() => setActiveTemplate(2)}
              className={`flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-xl border-2 ${
                activeTemplate === 2 ? "border-appGreen" : "border-transparent"
              }`}
            >
              <span>🏢</span>
              <span>Sleek</span>
            </Button>
            <Button
              onClick={() => setActiveTemplate(3)}
              className={`flex flex-col items-center py-10 w-full flex-grow bg-dark/80 rounded-xl border-2 ${
                activeTemplate === 3 ? "border-appGreen" : "border-transparent"
              }`}
            >
              <span>😊</span>
              <span>Cozy</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center">
        <Button
          onClick={() =>
            set({
              createFormOpen: false,
              selectFormOpen: false,
              selectedMapTemplate: false,
            })
          }
          className="bg-dark/80 gap-2 flex items-center px-4 py-6 rounded-lg"
        >
          Back
        </Button>
        <Button
          onClick={() => {
            set({
              createFormOpen: true,
              selectFormOpen: false,
              selectedMapTemplate: true,
            });

            switch (activeTemplate) {
              case 0:
                setUI({ mapKey: "map" });
                break;

              case 1:
                setUI({ mapKey: "map" });
                break;
              case 2:
                setUI({ mapKey: "map" });
                break;
              case 3:
                setUI({ mapKey: "map" });
                break;

              default:
                break;
            }
          }}
          className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg"
        >
          <CircleCheckBig size={15} />
          Confirm
        </Button>
      </div>
    </div>
  );
};
