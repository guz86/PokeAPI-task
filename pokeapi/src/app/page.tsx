'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  sprites: {
    front_default: string | null;
  };
  types: PokemonType[];
}

interface Pokemon {
  name: string;
  url: string;
  sprite?: string | null;
  typeNames?: string[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [types, setTypes] = useState<TypeResult[]>([]);

  const pokemonHeight = 300;
  const pokemonWidth = 300;

  const calculateInitialLimit = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const blocksInRow = Math.floor(screenWidth / pokemonWidth);
    const blocksInColumn = Math.ceil((screenHeight * 1.3) / pokemonHeight);

    return blocksInRow * blocksInColumn;
  };

  const fetchAllPokemonNames = async () => {
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

      const allPokemon: { name: string; url: string }[] = data.results.map(
        (pokemon: Pokemon) => ({
          name: pokemon.name,
          url: pokemon.url,
        })
      );

      setAllPokemon(allPokemon);

      console.log('fetchAllPokemonNames allPokemon', allPokemon);
    } catch (error) {
      console.log('Error fetching all Pokemon names:', error);
    }
  };

  const fetchPokemons = async (
    limit: number,
    currentOffset: number,
    pokemons: Pokemon[],
    searchTerm: string | null,
    pokemonsType: string | null
  ) => {
    setIsLoading(true);
    try {
      console.log('limit', limit);
      console.log('currentOffset', currentOffset);

      console.log('fetchPokemons pokemonsFilter', pokemonsType);
      let pokemonsFilter;
      if (pokemonsType && pokemonsType != 'all') {
        const pokemonsByType = await fetchPokemonsByType(pokemonsType);
        console.log('fetchPokemons pokemonsByType', pokemonsByType);
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

      console.log('pokemonsSimpleData', pokemonsSimpleData);

      const pokemonsWithDetails = await Promise.all(
        pokemonsSimpleData.map(async (pokemon: Pokemon) => {
          const details = await fetchPokemonDetails(pokemon.url);
          return { ...pokemon, ...details };
        })
      );

      setPokemons((prev) => [...prev, ...pokemonsWithDetails]);

      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.log('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPokemonDetails = async (
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

  useEffect(() => {
    fetchAllPokemonNames();
    fetchTypes();
  }, []);

  useEffect(() => {
    if (allPokemon.length > 0) {
      setPokemons([]);
      const initialLimit = calculateInitialLimit();
      fetchPokemons(initialLimit, 0, allPokemon, searchTerm, selectedType);
      console.log('fetchPokemons pokemons', pokemons);
    }
  }, [allPokemon]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading
    ) {
      fetchPokemons(10, offset, allPokemon, searchTerm, selectedType);
    }
  }, [offset, isLoading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setOffset(0);
    setPokemons([]);

    const initialLimit = calculateInitialLimit();
    fetchPokemons(initialLimit, 0, allPokemon, searchTerm, selectedType);
  }, [searchTerm]);

  useEffect(() => {
    setOffset(0);
    setPokemons([]);

    const initialLimit = calculateInitialLimit();
    fetchPokemons(initialLimit, 0, allPokemon, searchTerm, selectedType);
  }, [selectedType]);

  interface TypeResponse {
    name: string;
    pokemon: PokemonTypeResponse[];
  }
  interface PokemonTypeResponse {
    slot: number;
    pokemon: Pokemon;
  }

  interface TypeResult {
    name: string;
    url: string;
  }

  interface TypesApiResponse {
    count: number;
    results: TypeResult[];
  }

  const fetchTypes = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      if (!response.ok) throw new Error('Error fetching types');
      const data: TypesApiResponse = await response.json();
      setTypes(data.results.slice(0, -1));
      console.log('data.results', data.results);
    } catch (error) {
      console.error('Error fetching types:', error);
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

  return (
    <div className='flex flex-col items-center gap-2.5'>
      <input
        type='text'
        placeholder='Search Pokemon'
        className='p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-md hover:shadow-lg text-black'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className='p-2 mb-4 text-black border border-gray-300 rounded-md'
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value='all'>All</option>
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>

      <div className='flex flex-row flex-wrap justify-center items-center gap-2'>
        {pokemons.length > 0 ? (
          pokemons.map((pokemon, index) => (
            <Link
              href={`/pokemon/${pokemon.name}`}
              key={`${pokemon.url}-${index}`}
            >
              <div
                className='p-10 flex flex-col items-center bg-gray-800 h-80 w-80'
                key={pokemon.url}
              >
                <h2 className='text-4xl font-semibold capitalize text-gray-400'>
                  {pokemon.name}
                </h2>
                {pokemon.sprite && (
                  <img src={pokemon.sprite} alt={pokemon.name} width='150px' />
                )}
                <div className='text-2xl font-semibold capitalize text-gray-500'>
                  Type: {pokemon.typeNames?.join(', ') || 'Unknown'}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No Pokemon found</p>
        )}
      </div>
    </div>
  );
}
