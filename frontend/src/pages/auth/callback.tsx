import React, { useEffect } from "react";

type CallbackProps = {};

const Callback: React.FC<CallbackProps> = () => {
  useEffect(() => {
    if (window.opener && window.opener.location.pathname === "/auth/login") {
      window.opener.location.replace("/home");
    } else {
      window.location.replace("/home");
    }

    if (window.opener) {
      window.close();
    }
  });

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        Please Wait ...{" "}
      </div>
    </>
  );
};

export default Callback;
