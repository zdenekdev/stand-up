import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import townsReducer from "./slices/townsSlice";

export default configureStore({
  reducer: {
    filter: filterReducer,
    towns: townsReducer,
  },
});
