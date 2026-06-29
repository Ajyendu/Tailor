import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const loadClothes = () => {
  try {
    const saved = localStorage.getItem("clothes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  clothes: loadClothes(),
};

export const ClothSlice = createSlice({
  name: "cloth",
  initialState,
  reducers: {
    addCloth: (state, action) => {
      const cloth = {
        id: nanoid(),
        name: action.payload.name,
        makingCharge: action.payload.makingCharge,
        sizes: action.payload.sizes,
      };
      state.clothes.push(cloth);
    },
    removeCloth: (state, action) => {
      state.clothes = state.clothes.filter(
        (cloth) => action.payload != cloth.id
      );
    },
    updateCloth: (state, action) => {
      const cloth = state.clothes.find(
        (cloth) => cloth.id === action.payload.id
      );
      if (cloth) {
        cloth.name = action.payload.name;
        cloth.makingCharge = action.payload.makingCharge;
        cloth.sizes = action.payload.sizes; // ✅ Fix: was action.payload.charges (copy-paste bug)
      }
    },
  },
});

export const { addCloth, removeCloth, updateCloth } = ClothSlice.actions;

export default ClothSlice.reducer;
