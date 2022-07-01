import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import Head from "next/head";
import { store } from "../data/store";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>MMF Browser</title>
        <meta name="description" content="MMF Browser!" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
