export const fetchPokemonData = async (name: string) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

  if (!response.ok) throw new Error('Error fetching Pokemon data');

  return await response.json();
};
