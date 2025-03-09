import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: {},
  openResultBox: false,
  loading: false
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
      getResult(state, action) {
        state.result = action.payload;
      },
      handleResultBox(state, action) {
        state.openResultBox = action.payload;
      },
      handleLoading(state, action){
        state.loading = action.payload;
      }
    },
  });


export default searchSlice.reducer;

export const {handleResultBox, handleLoading} = searchSlice.actions;

export function SetResult(result) {
  return (dispatch, getState) => {
    dispatch(searchSlice.actions.getResult(result));
  };
}