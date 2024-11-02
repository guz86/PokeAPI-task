import { Pokemon } from '@/features/types';

export const fetchAllPokemonNames = async (): Promise<Pokemon[]> => {
  try {
    const responseCount = await fetch('https://pokeapi.co/api/v2/pokemon');
    if (!responseCount.ok) throw new Error('Error fetching total count');
    const dataCount = await responseCount.json();
    const totalCount = dataCount.count;

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${totalCount}`
    );
    if (!response.ok) throw new Error('Error fetching response data');
    const data = await response.json();

    const allPokemon: Pokemon[] = data.results.map((pokemon: Pokemon) => ({
      name: pokemon.name,
      url: pokemon.url,
    }));

    return allPokemon;
  } catch (error) {
    console.error('Error fetching all Pokemon names:', error);
    return [];
  }
};
