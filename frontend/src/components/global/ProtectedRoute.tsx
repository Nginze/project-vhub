import React, { useContext, useEffect, FC, ComponentType } from "react";
import { useRouter } from "next/router";
import { userContext } from "@/context/UserContext";
import Head from "next/head";
import Loader from "./Loader";
import { Grid } from "../ui/grid";
import { LoaderOverlay } from "./LoaderOverlay";

interface Props {
  [key: string]: any;
}

export const withProtectedRoute = (WrappedComponent: ComponentType<Props>) => {
  const ProtectedRoute: FC<Props> = (props) => {
    const { user, userLoading } = useContext(userContext);
    const router = useRouter();
    const { pathname } = router;

    useEffect(() => {
      if (
        !userLoading &&
        pathname !== "/auth/login" &&
        (!user || !user.userId)
      ) {
        window.location.href = "/auth/login";
      }
    }, [userLoading, pathname, user]);

    if (userLoading && pathname != "/auth/login") {
      return (
        <>
          <Head>
            <title>Holoverse</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin=""
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            ></link>

            <link
              href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@100;200;300;400;500;600;700;800;900&display=swap"
              rel="stylesheet"
            ></link>
          </Head>
          <div className="bg-void text-white w-screen h-screen flex items-center justify-center">
            <Grid />
            <div className="flex items-center gap-2">
              <LoaderOverlay />
              {/* <Loader alt width={15} />
              <span>Checking authentication status ...</span> */}
            </div>
          </div>
        </>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedRoute;
};
