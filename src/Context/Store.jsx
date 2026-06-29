import ClothSlice from "./ClothSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: ClothSlice,
});
export default store;
