import { api } from "@/api";
import { UploadDropZone } from "@/engine/file-uploader/utils";
import { Image, ImagePlus, Link, Router } from "lucide-react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {} from "uploadthing/client";

type Props = {
  setUploaderOpen: any;
};

const FileUploader = ({ setUploaderOpen }: Props) => {
  const [previewSrc, setPreview] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    setPreview(URL.createObjectURL(files[0]));
    setPreviewName(files[0].name);
  };

  return (
    <div className="w-full h-full flex flex-col relative items-center ">
      {previewSrc && (
        <div className="flex items-end gap-2 absolute rounded-lg bottom-0">
          <span className="text-white opacity-55 flex items-center gap-2">
            Preview:  {previewName}
            {/* <ImagePlus size={15} /> */}
          </span>
          <img
            src={previewSrc}
            alt="Preview"
            className="w-7 h-7 object-contain cursor-pointer outline-2 outline-appGreen outline-offset-4"
          />
        </div>
      )}
      <UploadDropZone
        className="bg-transparent ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 ut-button:bg-veryLight  ut-button:cursor-pointer"
        endpoint="imageUploader"
        onDrop={handleDrop}
        onClientUploadComplete={async (res: any) => {
          try {
            console.log("uploadthing", res);
            await api.patch("/me/update/avatar", {
              avatarUrl: res[0].url,
            });
            setUploaderOpen(false);
            toast.success("Profile image changed");
          } catch (error) {
            console.log(error);
          }
        }}
        onUploadError={(error: Error) => {
          toast.error("Profile change failed");
        }}
      />
    </div>
  );
};

export default FileUploader;
