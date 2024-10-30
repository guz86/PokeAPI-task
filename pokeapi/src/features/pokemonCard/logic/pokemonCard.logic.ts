'use client';

import { addFavorite, removeFavorite } from '@/store/favoritesSlice';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { Pokemon } from '@/features/types';

interface PokemonCardLogicProps {
  pokemon: Pokemon;
}

const usePokemonCardLogic = ({ pokemon }: PokemonCardLogicProps) => {
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const isFavorite = favorites.includes(pokemon.name);

  const handleAddToFavorites = useCallback(() => {
    dispatch(addFavorite(pokemon.name));
  }, [dispatch, pokemon.name]);

  const handleRemoveFromFavorites = useCallback(() => {
    dispatch(removeFavorite(pokemon.name));
  }, [dispatch, pokemon.name]);

  return {
    isFavorite,
    handleAddToFavorites,
    handleRemoveFromFavorites,
  };
};

export default usePokemonCardLogic;
