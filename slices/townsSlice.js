import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "towns",
  initialState: {
    cz: ["Praha", "Brno", "Ostrava"],
    sk: ["Bratislava", "Košice"],
  },
  reducers: {
    cz: (state, action) => {
      state.cz = action.payload;
    },
    sk: (state, action) => {
      sk.place = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { cz, sk } = filterSlice.actions;

export const selectCz = (state) => state.towns.cz;
export const selectSk = (state) => state.towns.sk;

export default filterSlice.reducer;
