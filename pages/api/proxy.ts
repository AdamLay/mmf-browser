// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const urlAction = req.query["action"];
  const sessid = req.headers["sessid"] as string;
  const fetchRes = await get("https://www.myminifactory.com/data-library/" + urlAction, sessid);
  res.status(200).json(fetchRes);
}


const get = async (url: string, sessid: string) => {
  const res = await fetch(url, {
    headers: {
      cookie: "SESSID=" + sessid,
    },
  });
  if (url.includes("purchase")) {
    console.log(await res.text())
  }
  if (res.status === 200)
    return await res.json();
  var text = await res.text();
  console.log(text);
  throw "failed req";
}