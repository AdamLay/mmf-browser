import type { NextPage, NextPageContext } from "next";

import { useRouter } from "next/router";
import axios from "axios";
import { useAppDispatch } from "../data/store";
import { setAccessToken } from "../data/appSlice";

const OAuth: NextPage = (props: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isServerSide = typeof window === "undefined";

  if (props.access_token && !isServerSide) {
    dispatch(setAccessToken(props.access_token));
    router.replace("/");
  }

  return null;
};

export async function getServerSideProps(context: NextPageContext) {
  const code = context.query["code"];
  const buf = Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET);
  const auth = buf.toString("base64");

  const url = `https://auth.myminifactory.com/v1/oauth/tokens`;
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code as string);
  params.append("redirect_uri", "http://localhost:3000/oauth");
  const res = await axios.post(url, params, {
    headers: {
      Authorization: "Basic " + auth,
    },
  });
  // Pass data to the page via props
  return { props: res.data };
}

export default OAuth;
