import ClothSlice from "./ClothSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: { cloth: ClothSlice },
});
export default store;
