import React, { useState, useEffect, useRef, useContext } from "react";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { CircleCheckBig, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "@radix-ui/react-context-menu";
import { Input } from "phaser";
import { Toggle } from "../ui/toggle";
import { AiOutlineScissor } from "react-icons/ai";
import { userContext } from "@/context/UserContext";
import axios from "axios";
import { Grid } from "../ui/grid";
import { api } from "@/api";
import toast from "react-hot-toast";
import { FaPerson } from "react-icons/fa6";
import Loader from "../global/Loader";

type HomeCharacterCustomizerProps = {};

export const HomeCharacterCustomizer: React.FC<
  HomeCharacterCustomizerProps
> = () => {
  const [base, setBase] = useState("");
  const [eyes, setEyes] = useState("");
  const [hair, setHair] = useState("");
  const [clothing, setClothing] = useState("");
  const [accessories, setAccessories] = useState("");
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [hairstyleSelected, setHairstyleSelected] = useState(false);
  const { user, userLoading } = useContext(userContext);
  const canvasRef = useRef(null);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    fetch("/preview_mappings.json")
      .then((response) => response.json())
      .then((data) => setMappings(data));
  }, []);

  useEffect(() => {
    if (
      !base &&
      !eyes &&
      !clothing &&
      !hair &&
      !accessories &&
      user.spriteUrl
    ) {
      drawSpriteSheet();
    } else {
      drawCharacter();
    }
  }, [base, eyes, clothing, hair, accessories]);

  const drawCharacter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    //@ts-ignore
    const ctx = canvas.getContext("2d");
    //@ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const parts = [base, eyes, hair, clothing, accessories];
    parts.forEach((part) => {
      if (part) {
        const img = new Image();
        img.src = part;
        img.onload = () => {
          const scale = 1.4; // Increase this to increase the size of the image
          //@ts-ignore
          const x = canvas.width / 2 - (img.width * scale) / 2;
          //@ts-ignore
          const y = canvas.height / 2 - (img.height * scale) / 2;

          // Draw the shadow
          const shadowRadius = (img.width * scale) / 3; // Slightly increase the radius of the shadow
          const shadowX = x + (img.width * scale) / 2;
          const shadowY = y + img.height * scale;
          ctx.save();
          ctx.scale(1.5, 1); // Stretch the circle horizontally
          ctx.beginPath();
          ctx.arc(shadowX / 1.5, shadowY, shadowRadius, 0, Math.PI * 2);
          ctx.fillStyle = "white"; // Set the color of the shadow
          ctx.fill();
          ctx.restore();

          // Draw the part
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
      }
    });
  };

  const drawSpriteSheet = () => {
    const canvas = canvasRef.current;
    if (!canvas || !user.spriteUrl) return;

    //@ts-ignore
    const ctx = canvas.getContext("2d");

    //@ts-ignore
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = user.spriteUrl;
    img.onload = () => {
      const frameWidth = 32;
      const frameHeight = 64;
      const scale = 1.5; // Increase this to increase the size of the image

      //@ts-ignore
      const x = canvas.width / 2 - (frameWidth * scale) / 2;

      //@ts-ignore
      const y = canvas.height / 2 - (frameHeight * scale) / 2;

      // Draw the shadow
      const shadowRadius = (frameWidth * scale) / 3; // Slightly increase the radius of the shadow
      const shadowX = x + (frameWidth * scale) / 2;
      const shadowY = y + frameHeight * scale;
      ctx.save();
      ctx.scale(1.5, 1); // Stretch the circle horizontally
      ctx.beginPath();
      ctx.arc(shadowX / 1.5, shadowY, shadowRadius, 0, Math.PI * 2);
      ctx.fillStyle = "white"; // Set the color of the shadow
      ctx.fill();
      ctx.restore();

      // Draw the character
      ctx.drawImage(
        img,
        frameWidth * 3, // Start at the width of three frames to get the fourth frame
        0,
        frameWidth,
        frameHeight,
        x,
        y,
        frameWidth * scale,
        frameHeight * scale
      );
    };
  };
  const handleSelection = (setter: any) => (url: any) => {
    setter(url);
  };

  const handleFinishEditing = async () => {
    try {
      setSavingLoading(true);
      const bodyParts = [
        mappings[base],
        mappings[eyes],
        mappings[hair],
        mappings[clothing],
        mappings[accessories],
      ];
      const { data } = await axios.post("/api/sprite", {
        bodyParts,
        userId: user.userId,
      });

      await api.patch("/me/update/sprite", {
        spriteUrl: data.spriteSheetUrl,
        userId: user.userId,
      });

      toast("Character Updated", {
        icon: <FaPerson size={19} />,
        style: {
          borderRadius: "100px",
          background: "#333",
          padding: "14px",
          color: "#fff",
        },
      });

      setSavingLoading(false);

      console.log(data.spriteSheetUrl);
    } catch (error) {
      toast("Save Failed", {
        icon: <FaPerson size={19} />,
        style: {
          borderRadius: "100px",
          background: "#333",
          padding: "14px",
          color: "#fff",
        },
      });
      console.log(error);
    }
  };

  const filteredMappings = {
    Base: Object.keys(mappings).filter(
      (key) => key.includes("Bodies") && !key.includes("kid")
    ),
    Eyes: Object.keys(mappings).filter(
      (key) => key.includes("Eyes") && !key.includes("kid")
    ),
    Clothing: Object.keys(mappings).filter(
      (key) => key.includes("Outfits") && !key.includes("kid")
    ),
    Accessories: Object.keys(mappings).filter((key) =>
      key.includes("Accessories")
    ),
    Hairstyles: Object.keys(mappings).filter(
      (key) => key.includes("Hairstyles") && !key.includes("kid")
    ),
  };

  return (
    <>
      <div className="flex h-[530px] items-center flex-col">
        <div className="w-full relative border-b border-b-light h-1/3 px-5 bg-deep rounded-t-lg">
          <canvas
            className="w-full flex items-center -mt-8 justify-center"
            ref={canvasRef}
          />
          <div className="absolute top-2 bg-void p-1 px-4 text-[12px] rounded-xl left-3 border border-light truncate-div w-[80px]">
            <span className="truncate-span">{user ? user.userName : ""}</span>
          </div>
        </div>
        <div className="w-full flex-grow p-6 overflow-y-hidden ">
          <Tabs defaultValue="Base" className="w-full ">
            <TabsList className="w-3/4 mx-auto bg-void rounded-xl  text-white border border-light ">
              <TabsTrigger className="rounded-xl" value="Base">
                Base
              </TabsTrigger>
              <TabsTrigger className="rounded-xl" value="Eyes">
                Eyes
              </TabsTrigger>
              <TabsTrigger className="rounded-xl" value="Outfits">
                Outfits
              </TabsTrigger>
              <TabsTrigger className="rounded-xl" value="Accessories">
                Accessories
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Base" className="h-full overflow-y-auto">
              <div className="py-1">
                <Toggle
                  onClick={() => {
                    setHairstyleSelected(!hairstyleSelected);
                  }}
                  aria-label="Hairstyles"
                  className="flex rounded-xl active:bg-deep  hover:text-white hover:bg-light p-3  items-center gap-1"
                >
                  <AiOutlineScissor size={16} className="opacity-70" />{" "}
                  <span className="opacity-70 font-semibold text-sm">Hair</span>{" "}
                  {/* Added text-sm to reduce font size */}
                </Toggle>
              </div>
              <div className="grid grid-cols-4 gap-2 max-h-[600px] overflow-y-auto py-2">
                {
                  <button
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      (base === "" && hairstyleSelected === false) ||
                      (hair === "" && hairstyleSelected === true)
                        ? "border-2 border-appGreen"
                        : ""
                    }`}
                    onClick={() => {
                      if (!hairstyleSelected) {
                        handleSelection(setBase)("");
                      } else {
                        handleSelection(setHair)("");
                      }
                    }}
                  >
                    <X />
                  </button>
                }
                {!hairstyleSelected
                  ? filteredMappings.Base.map((url, index) => (
                      <button
                        key={index}
                        className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                          base === url ? "border-2 border-appGreen" : ""
                        }`}
                        onClick={() => handleSelection(setBase)(url)}
                      >
                        <img
                          src={url}
                          alt={`body ${index + 1}`}
                          className="h-10"
                        />
                      </button>
                    ))
                  : filteredMappings.Hairstyles.map((url, index) => (
                      <button
                        key={index}
                        className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                          hair === url ? "border-2 border-appGreen" : ""
                        }`}
                        onClick={() => handleSelection(setHair)(url)}
                      >
                        <img
                          src={url}
                          alt={`hair ${index + 1}`}
                          className="h-10"
                        />
                      </button>
                    ))}
              </div>
            </TabsContent>

            <TabsContent value="Eyes" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[450px] overflow-y-auto py-2">
                {
                  <button
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      eyes === "" ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setEyes)("")}
                  >
                    <X />
                  </button>
                }
                {filteredMappings.Eyes.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      eyes === url ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setEyes)(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-16" />
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Outfits" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {
                  <button
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      clothing === "" ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setClothing)("")}
                  >
                    <X />
                  </button>
                }
                {filteredMappings.Clothing.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      clothing === url ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setClothing)(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Accessories" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {
                  <button
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      accessories === "" ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setAccessories)("")}
                  >
                    <X />
                  </button>
                }
                {filteredMappings.Accessories.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      accessories === url ? "border-2 border-appGreen" : ""
                    }`}
                    onClick={() => handleSelection(setAccessories)(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <DialogFooter className="flex px-6 pb-6">
        <Button
          disabled={savingLoading}
          onClick={() => handleFinishEditing()}
          className="bg-appGreen gap-2 flex items-center px-4 py-6 rounded-lg w-full"
        >
          {savingLoading ? (
            <Loader width={20} alt />
          ) : (
            <>
              <CircleCheckBig size={15} />
              Save Changes
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};
