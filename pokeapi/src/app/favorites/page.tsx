'use client';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { RootState } from '../../store/store';
import { Pokemon } from '@/features/pokemon/types/pokemon';
import PokemonList from '@/features/pokemon/components/PokemonList';

export default function FavoritesPage() {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const pokemonFavorites: Pokemon[] = favorites.map((favorite, index) => ({
    id: index,
    name: favorite.name,
  }));

  return (
    <div className='flex flex-col items-center gap-4 p-4'>
      <div className='flex justify-between items-center w-full mb-4 p-4 bg-gray-700'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-white cursor-pointer'>
            Pokedex
          </h1>
        </Link>
        <Link href='/favorites'>
          <button className='px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 transition'>
            Favorites
          </button>
        </Link>
      </div>
      <h1 className='text-4xl font-semibold text-gray-300'>Favorite Pokémon</h1>
      {pokemonFavorites.length > 0 ? (
        <PokemonList pokemons={pokemonFavorites} />
      ) : (
        <p className='text-lg text-gray-500'>No select Pokemon</p>
      )}
    </div>
  );
}
