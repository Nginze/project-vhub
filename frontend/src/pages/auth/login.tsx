import { NextPage } from "next";
import React from "react";

const POP_UP_WIDTH = 400;
const POP_UP_HEIGHT = 500;

const Login: NextPage = () => {
  const left =
    typeof window !== "undefined" && window.innerWidth / 2 - POP_UP_WIDTH / 2;
  const top =
    typeof window !== "undefined" && window.innerHeight / 2 - POP_UP_HEIGHT / 2;

  const googleLogin = () => {
    window.open(
      `${
        process.env.NODE_ENV == "production"
          ? `${process.env.NEXT_PUBLIC_PROD_API}/auth/google`
          : `${process.env.NEXT_PUBLIC_DEV_API}/auth/google`
      }`,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
  scrollbars=no, resizable=no, copyhistory=no, width=${POP_UP_WIDTH}, 
  height=${POP_UP_HEIGHT}, top=${top}, left=${left}`
    );
  };

  return (
    <div className="w-screen h-screen  flex items-center justify-center">
      <button
        className="bg-blue-500 px-3 py-2 rounded-sm"
        onClick={() => googleLogin()}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default Login;
