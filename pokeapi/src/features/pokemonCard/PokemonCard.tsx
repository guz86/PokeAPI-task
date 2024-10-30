'use client';

import { addFavorite, removeFavorite } from '@/store/favoritesSlice';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Pokemon } from '../types';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );
  const isFavorite = favorites.some((name) => name === pokemon.name);

  const handleAddToFavorites = () => {
    dispatch(addFavorite(pokemon.name));
  };

  const handleRemoveFromFavorites = () => {
    dispatch(removeFavorite(pokemon.name));
  };

  return (
    <div className='p-5 flex flex-col gap-4 items-center bg-gray-800 h-80 w-80'>
      <Link href={`/pokemon/${pokemon.name}`}>
        <h2 className='text-2xl font-semibold capitalize text-gray-400'>
          {pokemon.name}
        </h2>
        {pokemon.sprite && (
          <img src={pokemon.sprite} alt={pokemon.name} width='150px' />
        )}
        <div className='text-2xl font-semibold capitalize text-gray-500'>
          Type: {pokemon.typeNames?.join(', ') || 'Unknown'}
        </div>
      </Link>
      {isFavorite ? (
        <button onClick={handleRemoveFromFavorites}>
          Remove from Favorites
        </button>
      ) : (
        <button onClick={handleAddToFavorites}>Add to Favorites</button>
      )}
    </div>
  );
};

export default PokemonCard;
