import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../data/store";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Autocomplete,
  Button,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { getCampaigns, getTribes, getShared, setAccessToken, getPurchases } from "../data/appSlice";
import _ from "lodash";
import { Box, Container } from "@mui/system";
import dynamic from "next/dynamic";

const isServerSide = () => typeof window === "undefined";

const Home: NextPage = () => {
  const appState = useSelector((state: RootState) => state.app);
  const [searchText, setSearchText] = useState("");
  const [creators, setCreators] = useState<string[]>([]);
  const [sessid, setSessid] = useState(localStorage["mmf_lastSessid"] || "");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const authenticated = appState.accessToken;

  const creatorNames = useMemo(() => _.chain(appState.items).uniqBy(x => x.user_name).map(x => x.user_name).orderBy(x => x).value(), [appState.items]);
console.log(creatorNames)
  const groups = useMemo(() => {
    const filtered = appState.items.filter(
      (x: any) => {
        const searchValid = !searchText || x.name.toLowerCase().indexOf(searchText) > -1;
        const creatorValid = creators.length === 0 || creators.includes(x.user_name);
        return searchValid && creatorValid;
      }
    );
    const unique = _.uniqBy(filtered, (x) => x.name);
    return _.groupBy(unique, (x) => x.user_name);
  }, [searchText, creators, appState.items]);

  useEffect(() => {
    if (isServerSide()) return;
    const sessionToken = sessionStorage["mmf_access_token"];

    if (!authenticated) {
      if (sessionToken) {
        dispatch(setAccessToken(sessionToken));
      } else {
        // const url =
        //   "https://auth.myminifactory.com/web/authorize?client_id=mmg-browser&redirect_uri=http://localhost:3000/oauth&response_type=code&scope=download&state=" +
        //   nanoid();
        // router.push(url);
      }
    }
  }, [authenticated]);

  const onLoad = () => {
    localStorage["mmf_lastSessid"] = sessid;
    dispatch(getShared(sessid));
    dispatch(getCampaigns(sessid));
    dispatch(getTribes(sessid));
    //dispatch(getPurchases(sessid));
  };

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }} className="title-font">
            MMF Browser
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 2 }}>
        {appState.loading && <p>Loading...</p>}
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="MMF SESSID"
                variant="standard"
                sx={{ flex: 1 }}
                size="small"
                onChange={(e) => setSessid(e.target.value)}
                value={sessid}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" sx={{ mt: 1 }} onClick={onLoad}>
                Load
              </Button>
            </Grid>
          </Grid>
          <Typography>Find this in https://www.myminifactory.com/ - go to <code>Dev Tools (F12) -&gt; Application -&gt; Cookies -&gt; SESSID</code></Typography>
        </Box>
        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Search..."
                variant="standard"
                sx={{ flex: 1 }}
                size="small"
                onChange={(e) => setSearchText(e.target.value.toLowerCase())}
                value={searchText}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                options={creatorNames}
                value={creators}
                onChange={(e, newValue) => setCreators(newValue)}
                multiple
                renderInput={(params) => <TextField {...params} label="Creator" />} />
            </Grid>
          </Grid>
        </Box>
        {Object.keys(groups).map((key) => {
          const groupItems = _.orderBy(groups[key], x => x.id, "desc");
          return (
            <Accordion key={key} defaultExpanded={true}>
              <AccordionSummary>{key}</AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {groupItems.map((item: any) => (
                    <Grid key={item.id} item xs={6} sm={3} md={2}>
                      <img src={item.obj_img} onClick={() => window.open(item["download_url"], "_blank")} />
                      <p>{item.name}</p>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          );
        })}
        {/* {appState.shared?.items.map((item: any) => (
          <div key={item.id}>
            <p>{item.name}</p>
            {item.groups.items.map((group: any) => (
              <div key={group.id}>
                <Button onClick={() => loadGroup(group)}>{group.name}</Button>
              </div>
            ))}
          </div>
        ))} */}
      </Container>
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), { ssr: false });

//export default Home;
