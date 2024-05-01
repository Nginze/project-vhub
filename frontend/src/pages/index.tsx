import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter();

  // redirect to home always
  useEffect(() => {
    router.push("/room/room-1");
  }, []);
  return <></>;
};

export default Home;
