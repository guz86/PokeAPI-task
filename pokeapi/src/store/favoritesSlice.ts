import {
  FavoritePokemon,
  FavoritesState,
} from '@/features/favorites/types/pokemon.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoritePokemon>) => {
      const exists = state.favorites.some(
        (pokemon) => pokemon.name === action.payload.name
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (pokemon) => pokemon.name !== action.payload
      );
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
