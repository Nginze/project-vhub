import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../../../shared/types";

export const useLoadRoomMeta = (
  roomId: string,
  user: UserData,
  hasJoined: boolean = true
) => {
  const { isLoading: roomLoading, data: room } = useQuery({
    queryKey: ["room"],
    queryFn: async () => {
      try {
        const { data } = await api.get(
          `/room/${roomId}?userId=${user.userId}${
            hasJoined ? "&hasJoined=true" : ""
          }`
        );

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!user && !!roomId,
    staleTime: 90000,
    refetchOnWindowFocus: false,
  });

  const { isLoading: roomStatusLoading, data: roomStatus } = useQuery({
    queryKey: ["room-status", roomId],
    queryFn: async () => {
      try {
        const { data } = await api.get(
          `/room/room-status/${roomId}/${user.userId}`
        );

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: !!room,
    staleTime: 90000,
    refetchOnWindowFocus: false,
  });

  return {
    roomLoading,
    room,
    roomStatusLoading,
    roomStatus,
  };
};
