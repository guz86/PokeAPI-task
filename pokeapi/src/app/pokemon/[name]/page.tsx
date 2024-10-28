'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Move {
  move: { name: string };
}

interface PokemonDetails {
  name: string;
  weight: number;
  height: number;
  abilities: { ability: { name: string } }[];
  sprites: {
    front_default: string;
  };
  base_experience: number;
  moves: Move[];
}

const PokemonPage = () => {
  const { name } = useParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

      if (response.ok) {
        const data: PokemonDetails = await response.json();
        setPokemon(data);
      } else {
        console.error('Error fetching Pokemon data');
      }
    };

    fetchPokemon();
  }, [name]);

  if (!pokemon) return <div className='text-white'>Loading...</div>;

  return (
    <div className='flex flex-col min-h-screen bg-gray-900 p-4'>
      <button
        onClick={() => router.back()}
        className='self-start mb-4 px-4 py-2 text-sm text-black bg-gray-400 rounded hover:bg-gray-500 transition'
      >
        Back
      </button>
      <div className='flex justify-center items-center flex-grow'>
        <div className='bg-gray-800 rounded-lg shadow-lg max-w-full w-full sm:max-w-[600px] overflow-hidden'>
          <h1 className='p-5 text-3xl font-bold text-white capitalize'>
            Name: {pokemon.name}
          </h1>
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className='w-auto h-56 object-cover mx-auto'
          />
          <div className='p-6'>
            <p className='text-gray-300'>Weight: {pokemon.weight} hg</p>
            <p className='text-gray-300'>Height: {pokemon.height} dm</p>
            <p className='text-gray-300'>
              Base Experience: {pokemon.base_experience}
            </p>
            <h2 className='mt-4 text-xl font-semibold text-gray-200'>
              Abilities:
            </h2>
            <ul className='list-disc list-inside mt-2 text-gray-300'>
              {pokemon.abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
            <h2 className='mt-4 text-xl font-semibold text-gray-200'>Moves:</h2>
            <p className='text-gray-300'>
              {pokemon.moves.map((move) => move.move.name).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonPage;
