import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";

const Home: NextPage = () => {
  const [data, setData] = useState();
  const appState = useSelector((state: RootState) => state.app);
  const router = useRouter();
  const authenticated = !!appState.accessToken;

  useEffect(() => {
    if (!authenticated) {
      const url =
        "https://auth.myminifactory.com/web/authorize?client_id=mmg-browser&redirect_uri=http://localhost:3000/oauth&response_type=code&state=" +
        nanoid();
      router.push(url);
    }
  }, [authenticated]);

  return (
    <div className="container">
      <main>Home page!</main>
    </div>
  );
};

export default Home;

// http://localhost:8080/oauth?code=S0UkswRKdFtPP2jD3HeLsAdD-eNuprHga6UKbkLJGqMjf7irk0UtkL07GbE0KVhN&state=QQnwa5g3nqt0z1gkLPQgS
