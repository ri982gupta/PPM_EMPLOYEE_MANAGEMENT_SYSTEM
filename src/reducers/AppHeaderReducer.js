import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarShow: false,
  instanceId: 1,
  sidebarUnfoldable: false,
};

export const AppHeaderReducer = createSlice({
  name: "appHeaderState",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    set: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const payloadObj = action.payload;
      if (payloadObj.hasOwnProperty("sidebarUnfoldable"))
        state.sidebarUnfoldable = payloadObj.sidebarUnfoldable;
      else state.sidebarShow = payloadObj.sidebarShow;
    },
    resetSidebarShow: (state) => {
      state.sidebarShow = false; // Reset sidebarShow to false
    },
  },
});

export const { set, resetSidebarShow } = AppHeaderReducer.actions;

export default AppHeaderReducer.reducer;
