import { TypesApiResponse } from '@/features/types';

export const fetchTypes = async (): Promise<
  { name: string; url: string }[]
> => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/type');
    if (!response.ok) throw new Error('Error fetching types');
    const data: TypesApiResponse = await response.json();
    return data.results.slice(0, -1);
  } catch (error) {
    console.error('Error fetching types:', error);
    return [];
  }
};
