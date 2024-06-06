import { useRoomStore } from "@/global-store/RoomStore";
import { UserData } from "../../../../../shared/types";

export const createPlayerName = (user: UserData) => {
  const { userId, userName } = user;
  return `
      <div id="${userId}_indicator" style="display: flex; align-items: center; justify-content:center; color: rgba(255, 255, 255, 0.8); font-size: 10px; font-family: Inter; font-weight: bold; background: rgba(0, 0, 0, 0.4); padding: 2px 9px; border-radius: 50px; width: 67px; overflow: hidden;">
        <span id="${userId}_status_indicator" style="display: inline-block; width: 8px; height: 8px; background: #50C878; border-radius: 50%; margin-right: 3.9px;"></span>
        <span id="${userId}_speaker" style="margin-right: 5px; display:none; animation: dimInOut 3s infinite;">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
        </span>
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${userName}
        </div>
      </div>`;
};

export const createPlayerIcon = (user: UserData) => {
  const { userId } = user;
  const { currentReaction } = useRoomStore.getState();

  return `<div id="${userId}_icon" class='pop-in' style="position: relative; background: white; padding: 4px 10px; border-radius: 3px; text-align: center; font-size: 16px;">
            <span role="img" aria-label="emoji">${currentReaction}</span>
            <div style="position: absolute; bottom: -3px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid white;"></div>
         </div>`;
};
