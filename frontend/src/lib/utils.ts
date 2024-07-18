import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserData } from "../../../shared/types";
import toast, { Renderable, ToastPosition } from "react-hot-toast";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCamel = (snake: string) => {
  return snake.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
};

export const getSpritePreview = (
  spriteNumber: number,
  user: UserData
): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Create a new canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous"; // This is needed to avoid CORS issues
    img.src = user.spriteUrl;
    img.onload = () => {
      const frameWidth = 32;
      const frameHeight = 64;

      // Set the canvas size to the sprite size
      canvas.width = frameWidth;
      canvas.height = frameHeight;

      // Calculate the x and y position of the sprite
      const spritesPerRow = img.width / frameWidth;
      const spriteX = (spriteNumber % spritesPerRow) * frameWidth;
      const spriteY = Math.floor(spriteNumber / spritesPerRow) * frameHeight;

      ctx.drawImage(
        img,
        spriteX,
        spriteY,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      // Convert the canvas to a data URL and resolve the promise with it
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };

    // If the image fails to load, resolve the promise with null
    img.onerror = () => resolve(null);
  });
};

export const appToast = (
  content: string,
  icon: Renderable,
  position: ToastPosition
) => {
  toast(content, {
    icon,
    style: {
      borderRadius: "100px",
      background: "#333",
      padding: "14px",
      color: "#fff",
    },
    position,
  });
};
