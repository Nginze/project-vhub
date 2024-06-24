import { api } from "@/api";
import { UploadDropZone } from "@/engine/file-uploader/utils";
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import {} from "uploadthing/client";

type Props = {
  setUploaderOpen: any;
};

const FileUploader = ({ setUploaderOpen }: Props) => {
  return (
    <div className="w-full h-full">
      <UploadDropZone
        className="bg-transparent ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
        endpoint="imageUploader"
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
