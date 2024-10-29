'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { addFavorite, removeFavorite } from './store/favoritesSlice';

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

  const dispatch = useDispatch();
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const handleAddToFavorites = (pokemon: Pokemon) => {
    dispatch(addFavorite({ name: pokemon.name, url: pokemon.url }));
  };

  const handleRemoveFromFavorites = (pokemon: Pokemon) => {
    dispatch(removeFavorite(pokemon.name));
  };

  const isFavorite = (pokemon: Pokemon) =>
    favorites.some((fav) => fav.name === pokemon.name);

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
    } catch (error) {
      console.error('Error fetching all Pokemon names:', error);
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
      let pokemonsFilter;
      if (pokemonsType && pokemonsType != 'all') {
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

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading
    ) {
      fetchPokemons(10, offset, allPokemon, searchTerm, selectedType);
    }
  }, [offset, isLoading]);

  const [namesLoaded, setNamesLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await fetchAllPokemonNames();
        setNamesLoaded(true);
        await fetchTypes();
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
          const initialLimit = calculateInitialLimit();
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    setPokemons([]);
    setOffset(0);

    const initialLimit = calculateInitialLimit();
    fetchPokemons(initialLimit, 0, allPokemon, searchTerm, selectedType);
  }, [searchTerm, selectedType]);

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
          pokemons.map((pokemon) => (
            <div
              key={pokemon.name}
              className='p-10 flex flex-col gap-4 items-center bg-gray-800 h-80 w-80'
            >
              <Link href={`/pokemon/${pokemon.name}`}>
                <h2 className='text-4xl font-semibold capitalize text-gray-400'>
                  {pokemon.name}
                </h2>
                {pokemon.sprite && (
                  <img src={pokemon.sprite} alt={pokemon.name} width='150px' />
                )}
                <div className='text-2xl font-semibold capitalize text-gray-500'>
                  Type: {pokemon.typeNames?.join(', ') || 'Unknown'}
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFavorite(pokemon)) {
                    handleRemoveFromFavorites(pokemon);
                  } else {
                    handleAddToFavorites(pokemon);
                  }
                }}
                className='mb-4 px-4 py-2 text-sm text-black bg-gray-400 rounded hover:bg-gray-500 transition'
              >
                {isFavorite(pokemon)
                  ? 'Remove from Favorites'
                  : 'Add to Favorites'}
              </button>
            </div>
          ))
        ) : (
          <p>No Pokemon found</p>
        )}
      </div>
    </div>
  );
}
