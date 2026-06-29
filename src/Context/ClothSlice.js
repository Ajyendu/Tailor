import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
const initialState = {
  clothes: [{ id: 123, name: "Pant", charges: 20 }],
};

export const ClothSlice = createSlice({
  name: "cloth",
  initialState,
  reducers: {
    addCloth: (state, action) => {
      const cloth = {
        id: nanoid(),
        name: action.payload.name,
        charges: action.payload.charges,
      };
      state.clothes.push(cloth);
    },
    removeCloth: (state, action) => {
      state.clothes = state.clothes.filter(
        (cloth) => action.payload != cloth.id
      );
    },
    updateCloth: (state, action) => {
      state.clothes.filter((cloth) =>
        action.payload.id != cloth.id ? cloth : action.payload
      );
    },
  },
});

export const { addCloth, removeCloth, updateCloth } = ClothSlice.actions;

export default ClothSlice.reducer;
