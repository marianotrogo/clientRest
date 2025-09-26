// store/loaderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
    text: "Cargando...",
  },
  reducers: {
    showLoader: (state, action) => {
      state.isLoading = true;
      state.text = action.payload || "Cargando...";
    },
    hideLoader: (state) => {
      state.isLoading = false;
      state.text = "Cargando...";
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
