import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const wrap =
  (middleware: any) =>
  (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    next: (err?: ExtendedError | undefined) => void
  ) =>
    middleware(socket.request, {}, next);

export const generateUsername = (displayName: string) => {
  const lowercaseName = displayName.toLowerCase().replace(/\s+/g, "");
  const randomNumber = Math.floor(Math.random() * 10000); // You can adjust the range as needed
  const uniqueUsername = lowercaseName + randomNumber;
  return uniqueUsername;
};

export const parseCamel = <T>(obj: T): T => {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(parseCamel) as unknown as T;
  }

  const result = {} as T;

  Object.keys(obj)
    .sort()
    .forEach((key) => {
      const camelCaseKey = snakeToCamel(key);
      let value = (obj as any)[key];

      if (value instanceof Date) {
        // Check if the value is a Date object
        (result as any)[camelCaseKey] = value;
      } else if (typeof value === "object" && value !== null) {
        value = parseCamel(value);
        (result as any)[camelCaseKey] = value;
      } else {
        (result as any)[camelCaseKey] = value;
      }
    });

  return result;
};

export const generateSkinName = () => {
  const skins = ["nancy", "lucy", "ash", "adam"];
  const randomSkin = skins[Math.floor(Math.random() * skins.length)];
  return randomSkin;
};

const snakeToCamel = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
};
