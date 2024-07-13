import Head from "next/head";
import Image from "next/image";
import { BackgroundBeams } from "../ui/background-beams";

type LandingPageProps = {};

export const LandingPage: React.FC<LandingPageProps> = () => {
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
      <div className="w-screen h-screen font-body bg-neutral-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <span className="mb-4">
            <Image
              src="/assets/emotes/blobdance.gif"
              alt="blob"
              width={32}
              height={100}
            />
          </span>
          <span className="text-[18px] opacity-50 font-semibold">
            Coming Soon
          </span>
          <button>Test Sentry</button>

          <span className="text-[14px] opacity-20">
            Better spaces for your online events!
          </span>
        </div>
        <BackgroundBeams />
      </div>
    </>
  );
};
