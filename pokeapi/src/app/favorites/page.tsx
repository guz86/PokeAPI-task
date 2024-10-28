'use client';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import Link from 'next/link';

export interface Pokemon {
  id: number;
  name: string;
}

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className='p-4 border rounded shadow hover:shadow-lg transition-shadow'>
      <h2 className='text-lg font-semibold mt-2'>{pokemon.name}</h2>
    </div>
  );
};

interface PokemonListProps {
  pokemons: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

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
            Pokemon App
          </h1>
        </Link>
        <Link href='/favorites'>
          <button className='px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 transition'>
            Favorites
          </button>
        </Link>
      </div>
      <h1 className='text-4xl font-semibold text-gray-700'>Favorite pokemon</h1>
      {pokemonFavorites.length > 0 ? (
        <PokemonList pokemons={pokemonFavorites} />
      ) : (
        <p className='text-lg text-gray-500'>No select Pokemon</p>
      )}
    </div>
  );
}
