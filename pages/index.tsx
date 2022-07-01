import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../data/store";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { setAccessToken } from "../data/appSlice";
import axios from "axios";
import _ from "lodash";

const Home: NextPage = () => {
  const appState = useSelector((state: RootState) => state.app);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isServerSide = typeof window === "undefined";
  const authenticated = !!appState.accessToken;

  useEffect(() => {
    if (isServerSide) return;
    const sessionToken = sessionStorage["mmf_access_token"];

    if (!authenticated) {
      if (sessionToken) {
        dispatch(setAccessToken(sessionToken));
      } else {
        const url =
          "https://auth.myminifactory.com/web/authorize?client_id=mmg-browser&redirect_uri=http://localhost:3000/oauth&response_type=code&scope=download&state=" +
          nanoid();
        router.push(url);
      }
    } else {
      axios
        .get("https://www.myminifactory.com/api/v2/user", {
          headers: {
            authorization: "Basic " + appState.accessToken,
          },
        })
        .then((res) => {
          console.log("All", res.data);
        });
    }
  }, [authenticated]);

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} className="title-font">
            MMF Browser
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="container">
        <main>Home page!</main>
      </div>
    </>
  );
};

export default Home;
