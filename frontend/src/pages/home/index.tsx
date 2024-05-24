import { HomeGrid } from "@/components/home/HomeGrid";
import { HomeLayout } from "@/components/home/HomeLayout";
import { HomeNav } from "@/components/home/HomeNav";
import { HomeOptionsBar } from "@/components/home/HomeOptionsBar";
import { HomeRoomPreviewCard } from "@/components/home/HomeRoomPreviewCard";
import { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  return (
    <main className="w-screen h-auto bg-[#202225] flex justify-center py-5">
      <HomeLayout
        navbar={<HomeNav />}
        content={<HomeGrid />}
        optionbar={<HomeOptionsBar />}
      />
    </main>
  );
};

export default Home;
