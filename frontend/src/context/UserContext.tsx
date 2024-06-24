import { createContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserData } from "../../../shared/types/index";
import { api } from "../api";
import { useRendererStore } from "@/engine/2d-renderer/store/RendererStore";
import { useRouter } from "next/router";

type Props = {
  children: React.ReactNode;
};

interface UContext {
  user: UserData;
  userLoading: boolean;
}

export const userContext = createContext<UContext>({} as UContext);

const UserProvider = ({ children }: Props) => {
  const { set } = useRendererStore();
  const router = useRouter();

  const getUser = async () => {
    const { data: user } = await api.get("/auth/me");
    return user;
  };

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 90000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    set({ user });
  }, [user]);

  return (
    <userContext.Provider value={{ user, userLoading }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
