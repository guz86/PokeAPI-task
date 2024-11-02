import { PokemonDetails, PokemonType } from '@/features/types';

export const fetchPokemonDetails = async (
  url: string
): Promise<{ sprite: string | null; typeNames: string[] }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error fetching pokemon details');

    const data: PokemonDetails = await response.json();
    const sprite = data.sprites.front_default || 'file.svg';
    const typeNames = data.types.map(
      (typeObj: PokemonType) => typeObj.type.name
    );

    return { sprite, typeNames };
  } catch (error) {
    console.error('Error fetching pokemon details:', error);
    return { sprite: 'file.svg', typeNames: [] };
  }
};
