'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Pokemon } from '@/features/favorites/types/pokemon.types';
import PokemonList from '@/features/favorites/ui/pokemonList.component';
import Navbar from '@/features/navbar/ui/navbar.ui';

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
      <Navbar />
      <h1 className='text-4xl font-semibold text-gray-300'>Favorite Pokémon</h1>
      {pokemonFavorites.length > 0 ? (
        <PokemonList pokemons={pokemonFavorites} />
      ) : (
        <p className='text-lg text-gray-500'>No select Pokemon</p>
      )}
    </div>
  );
}
