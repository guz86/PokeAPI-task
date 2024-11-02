import { Pokemon, TypeResponse } from '@/features/types';

export const fetchPokemonsByType = async (type: string): Promise<Pokemon[]> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!response.ok) throw new Error('Error fetching Pokemon by type');

    const data: TypeResponse = await response.json();
    const pokemonList: Pokemon[] = data.pokemon.map((p) => ({
      name: p.pokemon.name,
      url: p.pokemon.url,
    }));

    return pokemonList;
  } catch (error) {
    console.error('Error fetching Pokemon by type:', error);
    return [];
  }
};
