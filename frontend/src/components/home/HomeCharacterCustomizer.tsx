import React, { useState, useEffect } from "react";
import fs from "fs";
import path from "path";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { CircleCheckBig } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "@radix-ui/react-context-menu";
import { Input } from "phaser";

type HomeCharacterCustomizerProps = {};

export const HomeCharacterCustomizer: React.FC<
  HomeCharacterCustomizerProps
> = () => {
  const [base, setBase] = useState("");
  const [eyes, setEyes] = useState("");
  const [clothing, setClothing] = useState("");
  const [accessories, setAccessories] = useState("");
  const [mappings, setMappings] = useState({});

  useEffect(() => {
    fetch("/preview_mappings.json")
      .then((response) => response.json())
      .then((data) => setMappings(data));
  }, []);

  const filteredMappings = {
    Base: Object.keys(mappings).filter((key) => key.includes("Bodies")),
    Eyes: Object.keys(mappings).filter((key) => key.includes("Eyes")),
    Clothing: Object.keys(mappings).filter((key) => key.includes("Outfits")),
    Accessories: Object.keys(mappings).filter((key) =>
      key.includes("Accessories")
    ),
  };

  return (
    <>
      <div className="flex h-[600px] items-center flex-col">
        <div className="w-full h-1/3"></div>
        <div className="w-full flex-grow">
          <Tabs defaultValue="Base" className="w-full ">
            <TabsList className="grid w-full grid-cols-4 bg-deep text-white border border-light ">
              <TabsTrigger value="Base">Base</TabsTrigger>
              <TabsTrigger value="Eyes">Eyes</TabsTrigger>
              <TabsTrigger value="Clothing">Clothing</TabsTrigger>
              <TabsTrigger value="Accessories">Accessories</TabsTrigger>
            </TabsList>
            <TabsContent value="Base" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {filteredMappings.Base.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      base === url
                        ? "outline outline-2 outline-offset-2 outline-appGreen"
                        : ""
                    }`}
                    onClick={() => setBase(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Eyes" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {filteredMappings.Eyes.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      base === url ? "ring-2 ring-appBlue" : ""
                    }`}
                    onClick={() => setBase(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Clothing" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {filteredMappings.Clothing.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      base === url ? "ring-2 ring-appBlue" : ""
                    }`}
                    onClick={() => setBase(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="Accessories" className="h-full overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 max-h-[500px] overflow-y-auto py-2">
                {filteredMappings.Accessories.map((url, index) => (
                  <button
                    key={index}
                    className={`w-auto rounded-lg h-16 bg-light flex items-center justify-center ${
                      base === url ? "ring ring-2 ring-appBule" : ""
                    }`}
                    onClick={() => setBase(url)}
                  >
                    <img src={url} alt={`body ${index + 1}`} className="h-10" />
                  </button>
                ))}
              </div>
            </TabsContent>
            {/* Repeat for other tabs */}
          </Tabs>
        </div>
      </div>
    </>
  );
};
