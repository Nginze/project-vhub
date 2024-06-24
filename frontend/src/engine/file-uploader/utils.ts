import { generateUploadDropzone } from "@uploadthing/react";
import { OurFileRouter, ourFileRouter } from "./uploadthing";

export const UploadDropZone =
  generateUploadDropzone<OurFileRouter>();
