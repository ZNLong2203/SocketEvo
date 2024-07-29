import "@/styles/globals.css";
import { StateProvider } from "@/context/StateContext";
import { initialState, reducer } from "@/context/StateReducers";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>SocketEvo</title>
        <link rel="shortcut icon" href="/ZkareLogo.png" type="image/x-icon" />
      </Head>
      <Component {...pageProps} />;
    </StateProvider>
  ) 
}