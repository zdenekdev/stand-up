import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {
    country: "Česko",
    place: "Všechna města",
    dateRangeT: "Kdykoliv",
    after: null,
    before: null,
  },
  reducers: {
    country: (state, action) => {
      state.country = action.payload;
    },
    place: (state, action) => {
      state.place = action.payload;
    },
    dateRangeT: (state, action) => {
      state.dateRangeT = action.payload;
    },
    after: (state, action) => {
      state.after = action.payload;
    },
    before: (state, action) => {
      state.before = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { after, before, place, country, dateRangeT } =
  filterSlice.actions;

export const selectFilter = (state) => state.filter;
export const selectCountry = (state) => state.filter.country;
export const selectPlace = (state) => state.filter.place;
export const selectBefore = (state) => state.filter.before;
export const selectAfter = (state) => state.filter.after;
export const selectDateRangeT = (state) => state.filter.dateRangeT;

export default filterSlice.reducer;
