import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCamel = (snake: string) => {
  return snake.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
};
