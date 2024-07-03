import { api } from "@/api";
import { HomeGrid } from "@/components/home/HomeGrid";
import { HomeLayout } from "@/components/home/HomeLayout";
import { HomeNav } from "@/components/home/HomeNav";
import { HomeOptionsBar } from "@/components/home/HomeOptionsBar";
import { HomeRoomPreviewCard } from "@/components/home/HomeRoomPreviewCard";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = React.useState("spaces");
  const [activeFilter, setActiveFilter] = React.useState("public");
  const [filterQuery, setFilterQuery] = React.useState("");

  const { data: publicRooms, isLoading: publicRoomsLoading } = useQuery({
    queryKey: ["rooms-public"],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/room/rooms/live`);

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <main className="w-screen h-auto bg-[#202225] flex justify-center py-5">
      <HomeLayout
        navbar={<HomeNav activeTab={activeTab} setActiveTab={setActiveTab} />}
        content={
          activeTab === "spaces" ? (
            <HomeGrid filterQuery={filterQuery} rooms={publicRooms} roomsLoading={publicRoomsLoading} />
          ) : (
            <>
              <div className="flex w-full h-full justify-center items-center">
                Coming Soon
              </div>
            </>
          )
        }
        optionbar={
          <HomeOptionsBar
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            filterQuery={filterQuery}
            setFilterQuery={setFilterQuery}
          />
        }
      />
    </main>
  );
};

export default Home;
