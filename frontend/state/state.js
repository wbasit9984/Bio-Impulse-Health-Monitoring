import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  currentPage: "Detections",
  detections: [],
  selectedData: null,
};

export const systemSlice = createSlice({
  name: "sys",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.currentPage = "Detections";
      state.detections = [];
      state.selectedData = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload.currentPage;
    },
    setDetections: (state, action) => {
      state.detections = action.payload.detections;
    },
    setSelectedData: (state, action) => {
      state.selectedData = action.payload.selectedData
    }
  },
});

export const { setLogin, setLogout, setCurrentPage, setDetections, setSelectedData } =
  systemSlice.actions;
export default systemSlice.reducer;
