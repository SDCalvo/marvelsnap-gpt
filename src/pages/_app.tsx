import React from "react";
import "../styles/global.css";
import type { AppProps } from "next/app";
import { AssistantProvider } from "@/contexts/AssistantContext";
import withNav from "@/components/Nav";

// MyApp component with AppProps type
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AssistantProvider>
      <Component {...pageProps} />
    </AssistantProvider>
  );
}

export default withNav(MyApp);
