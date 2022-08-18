import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface AppState {
  accessToken: string | null;
  loading: boolean;
  shared: any;
  items: any[];
  sessid: string;
}

const initialState: AppState = {
  accessToken: null,
  loading: false,
  shared: null,
  items: [],
  sessid: ""
};

const get = async (url: string, sessid: string) => {
  const res = await fetch(url, {
    headers: {
      "SESSID": sessid
    }
  });
  return await res.json();
};

export const getGroup = createAsyncThunk("app/getGroup", async (id: string, { getState }) => {
  const local = localStorage["mmf_group_" + id];
  if (local) {
    return JSON.parse(local);
  }
  const state: AppState = (getState() as RootState).app;
  const items = [];
  const getPage = async (page: number) => {
    return await get("/api/proxy?action=group/" + id + "%3Fpage%3D" + page, state!.sessid);
  }
  var page = 1;
  let maxPage = 1;
  var res = await getPage(page);
  items.push(...res.items);
  if (res["total_count"] > 20) {
    maxPage = Math.ceil(res["total_count"] / 20);
    while (page < maxPage) {
      var pageRes = await getPage(++page);
      items.push(...pageRes.items)
    }
  }
  localStorage["mmf_group_" + id] = JSON.stringify(items);
  return items;
});

export const getShared = createAsyncThunk("app/getShared", async (sessid: string, { dispatch, getState }) => {
  var res = await get("/api/proxy?action=shared", sessid);
  for (let item of res.items) {
    for (let group of item.groups.items.filter((x: any) => x.name !== "All")) {
      dispatch(getGroup(group.id));
    }
  }
  return { res, sessid };
});

export const getCampaigns = createAsyncThunk("app/getCampaigns", async (sessid: string, { dispatch, getState }) => {
  var res = await get("/api/proxy?action=campaigns", sessid);
  for (let item of res.items) {
    for (let group of item.pledges.items.filter((x: any) => x.name !== "All")) {
      console.log("Campaign item group", group);
      dispatch(getGroup(group.id));
    }
    //console.log("Campaign item", item);
  }
  return { res, sessid };
});

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = (sessionStorage["mmf_access_token"] = action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(getShared.pending, (state) => { state.loading = true; });
    builder.addCase(getGroup.pending, (state) => { state.loading = true; });
    builder.addCase(getShared.fulfilled, (state, action: PayloadAction<any>) => {
      state.shared = action.payload.res;
      state.sessid = action.payload.sessid;
      state.loading = false;
    });
    builder.addCase(getGroup.fulfilled, (state, action: PayloadAction<any[]>) => {
      state.items.push(...action.payload);
      state.loading = false;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setAccessToken } = appSlice.actions;

export default appSlice.reducer;
