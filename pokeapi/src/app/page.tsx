'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/features/navbar/ui/navbar.ui';
import SearchBar from '@/features/searchBar/ui/searchBar.ui';
import TypeSelect from '@/features/typeSelect/ui/typeSelect.ui';
import PokemonCard from '@/features/pokemonCard/PokemonCard';
import { Pokemon, TypeResponse } from '@/features/types';
import { fetchAllPokemonNames } from '@/hooks/pokemonService';
import { fetchTypes } from '@/hooks/fetchTypes';
import usePokemonLimit from '@/hooks/usePokemonLimit';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { fetchPokemonDetails } from '@/hooks/fetchPokemonDetails';

export default function Home() {
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

  const fetchPokemonsByType = async (type: string): Promise<Pokemon[]> => {
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

  return (
    <div className='flex flex-col items-center gap-2.5'>
      <Navbar />
      <div className='flex flex-row items-center gap-10'>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <TypeSelect
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          types={types}
        />
      </div>

      <div className='flex flex-row flex-wrap justify-center items-center gap-2'>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))
        ) : (
          <p>No Pokémon found.</p>
        )}
      </div>

      {isLoading && <p>Loading...</p>}
    </div>
  );
}
