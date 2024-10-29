// PokemonPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PokemonDetails } from '@/features/pokemon/types/pokemonDetails.types';
import { fetchPokemonData } from '@/features/pokemon/api/pokemon.api';
import PokemonDetailsUI from '@/features/pokemon/ui/pokemonDetails.ui';

const PokemonPage = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const data: PokemonDetails = await fetchPokemonData(name);
        setPokemon(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch Pokemon data.');
      }
    };

    fetchPokemon();
  }, [name]);

  if (error) return <div className='text-red-500'>{error}</div>;
  if (!pokemon) return <div className='text-white'>Loading...</div>;

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 p-4'>
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

      <div className='flex justify-center items-center flex-grow'>
        <PokemonDetailsUI pokemon={pokemon} />
      </div>
    </div>
  );
};

export default PokemonPage;
