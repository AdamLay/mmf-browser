import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  accessToken: string | null;
}

const initialState: AppState = {
  accessToken: null
};

// export const getFactions = createAsyncThunk("app/getFactions", async () => {
//   const factions = await ApiService.getFactions();
//   console.log("Loaded factions", factions);
//   return factions;
// });

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers(builder) {
    // builder.addCase(getFactions.fulfilled, (state, action: PayloadAction<Faction[]>) => {
    //   state.factions = action.payload;
    //   state.loading = isLoading(state);
    // });
  },
});

// Action creators are generated for each case reducer function
export const { setAccessToken } = appSlice.actions;

export default appSlice.reducer;
