import { LandingPage } from "@/components/global/LandingPage";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  return (
    <main>
      <LandingPage />
    </main>
  );
};

export default Home;
