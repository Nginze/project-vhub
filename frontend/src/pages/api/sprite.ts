import { createCanvas, loadImage } from "canvas";
import cloudinary from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { api } from "@/api";

cloudinary.v2.config({
  cloud_name: "hack-0",
  api_key: "418569145725966",
  api_secret: "zat3wFszQCshxRMa6IE8j4SyPQ4",
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { bodyParts, userId } = req.body;

    if (!bodyParts || bodyParts.length === 0) {
      throw new Error("No body parts provided");
    }

    const canvas = createCanvas(1792, 1312);
    const ctx = canvas.getContext("2d");

    for (const url of bodyParts) {
      if (!url) continue;
      
      let response;
      try {
        response = await axios.get(url, { responseType: "arraybuffer" });
      } catch (error) {
        throw new Error(`Failed to fetch from URL ${url}: ${error.message}`);
      }

      try {
        const img = await loadImage(response.data);
        ctx.drawImage(img, 0, 0, img.width, img.height);
      } catch (error) {
        throw new Error(
          `Failed to load image from URL ${url}: ${error.message}`
        );
      }
    }

    const spriteSheetBuffer = canvas.toBuffer();

    const result = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "image",
            public_id: `user_sprites/${userId}_sprite`,
            format: "png",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(spriteSheetBuffer);
      }
    );

    res.status(200).json({ spriteSheetUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
