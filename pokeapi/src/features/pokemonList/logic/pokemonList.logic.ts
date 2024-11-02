import { useEffect, useState } from 'react';
import { Pokemon } from '@/features/types';
import { fetchAllPokemonNames } from '@/hooks/fetchAllPokemonNames';
import { fetchTypes } from '@/hooks/fetchTypes';
import usePokemonLimit from '@/hooks/usePokemonLimit';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { fetchPokemonDetails } from '@/hooks/fetchPokemonDetails';
import { fetchPokemonsByType } from '@/hooks/fetchPokemonsByType';

const usePokemonListLogic = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [types, setTypes] = useState<{ name: string; url: string }[]>([]);
  const [namesLoaded, setNamesLoaded] = useState(false);
  const initialLimit = usePokemonLimit();

  const fetchPokemons = async (
    limit: number,
    currentOffset: number,
    pokemons: Pokemon[],
    searchTerm: string | null,
    pokemonsType: string | null
  ) => {
    setIsLoading(true);
    try {
      let pokemonsFilter;
      if (pokemonsType && pokemonsType !== 'all') {
        const pokemonsByType = await fetchPokemonsByType(pokemonsType);
        pokemonsFilter = pokemonsByType.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
        );
      } else {
        pokemonsFilter = pokemons.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchTerm?.toLowerCase() || '')
        );
      }

      const pokemonsSimpleData = pokemonsFilter.slice(
        currentOffset,
        currentOffset + limit
      );

      const pokemonsWithDetails = await Promise.all(
        pokemonsSimpleData.map(async (pokemon: Pokemon) => {
          const details = await fetchPokemonDetails(pokemon.url);
          return { ...pokemon, ...details };
        })
      );

      setPokemons((prev) => [...prev, ...pokemonsWithDetails]);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const allPokemonNames = await fetchAllPokemonNames();
        setAllPokemon(allPokemonNames);
        setNamesLoaded(true);

        const types = await fetchTypes();
        setTypes(types);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadPokemons = async () => {
      if (namesLoaded) {
        try {
          setPokemons([]);
          await fetchPokemons(
            initialLimit,
            0,
            allPokemon,
            searchTerm,
            selectedType
          );
        } catch (error) {
          console.error('Error fetching pokemons:', error);
        }
      }
    };

    loadPokemons();
  }, [namesLoaded]);

  useInfiniteScroll(isLoading, () =>
    fetchPokemons(10, offset, allPokemon, searchTerm, selectedType)
  );

  useEffect(() => {
    setPokemons([]);
    setOffset(0);
    fetchPokemons(initialLimit, 0, allPokemon, searchTerm, selectedType);
  }, [searchTerm, selectedType]);

  return {
    pokemons,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    types,
  };
};

export default usePokemonListLogic;
