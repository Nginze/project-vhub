import { lexendDeca, inter } from "@/lib/fonts";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className={`text-white overflow-hidden ${inter.className} ${lexendDeca.className}`}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
