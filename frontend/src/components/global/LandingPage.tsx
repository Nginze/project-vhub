import Head from "next/head";
import Image from "next/image";
import { LandingNav } from "../landing/LandingNav";
import { Typewriter } from "react-simple-typewriter";
import { Grid } from "../ui/grid";
import { LandingFooter } from "../landing/LandingFooter";
import { useRouter } from "next/router";

type LandingPageProps = {};

export const LandingPage: React.FC<LandingPageProps> = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="w-screen h-screen font-logo bg-ultra flex flex-col items-center">
        <div>
          <Grid />
          <div className="flex flex-col">
            <LandingNav />
            <section className="flex items-center z-10 justify-between w-full px-40 py-28">
              <div className="flex flex-col items-start gap-5">
                <div className="flex flex-col items-start">
                  <div className="mb-3">
                    <button
                      className="rounded-full hover:bg-light active:bg-deep bg-deep border-2 border-light px-4 text-[13px] py-2"
                      onClick={() =>
                        window.open("https://github.com/Nginze", "_blank")
                      }
                    >
                      🌟 Star us on Github
                    </button>
                  </div>
                  <span className="text-[40px]">A better way to </span>
                  <div className="text-appYellow font-bold text-[40px]">
                    <Typewriter
                      words={[
                        "Host Online Events",
                        "Gather",
                        "Engage Communities",
                        "Collaborate with others",
                      ]}
                      loop={true}
                      cursor={true}
                      delaySpeed={5500}
                    />
                  </div>
                </div>
                <span className="w-[650px] text-[20px]">
                  Centered around fully customizable spaces, Holo makes spending
                  time with your communities just as easy as real life
                </span>
                <button
                  onClick={() => router.push("/auth/login")}
                  className="bg-appPrimary active:bg-appPrimary/60 hover:ring-2 hover:ring-appPrimary ring-offset-2 px-6 py-4 mt-4 font-semibold rounded-2xl text-white"
                >
                  Get started for free
                </button>
              </div>
              <div className="relative">
                <div className="absolute w-[800px] h-[500px] bg-appPrimary opacity-50 rounded-3xl -bottom-2 -right-2"></div>
                <div className="relative w-[800px] h-[500px] border border-light rounded-3xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src="https://hiff.org/wp-content/uploads/2021/11/HIFF-gather.gif"
                    alt="landing hero"
                  />
                </div>
              </div>
            </section>
            <LandingFooter />
          </div>
        </div>
      </div>
    </>
  );
};
