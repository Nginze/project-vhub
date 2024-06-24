import { ourFileRouter } from "@/engine/file-uploader/uploadthing";
import { createRouteHandler } from "uploadthing/next-legacy";

const handler = createRouteHandler({
  router: ourFileRouter,
});

export default handler;
