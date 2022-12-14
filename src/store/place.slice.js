import { createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system";

import Place from "../model/Place";
import { URL_GEOCODING } from "../utils/maps";

const initialState = {
  places: [],
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    addPlace: (state, action) => {
      const newPlace = new Place(
        Date.now(),
        action.payload.title,
        action.payload.image,
        action.payload.address,
        action.payload.coords
      );
      state.places.push(newPlace);
    },
  },
});

export const { addPlace } = placeSlice.actions;

export const savePlace = (title, image, coords) => {
  return async (dispatch) => {
    const response = await fetch(URL_GEOCODING(coords?.lat, coords?.lng));

    if (!response.ok) throw new Error("Algo no funciono");

    const data = await response.json();

    if (!data.results) throw new Error("Algo no funciono");

    const address = data.results[0].formatted_address;

    try {
      dispatch(addPlace({ title, image, address, coords }));
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export default placeSlice.reducer;
