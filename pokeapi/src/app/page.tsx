'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import Navbar from '@/features/navbar/ui/navbar.ui';
import SearchBar from '@/features/searchBar/ui/searchBar.ui';
import TypeSelect from '@/features/typeSelect/ui/typeSelect.ui';
import PokemonCard from '@/features/pokemonCard/PokemonCard';

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
  const [types, setTypes] = useState<{ name: string; url: string }[]>([]);

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
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              sprite={pokemon.sprite}
              typeNames={pokemon.typeNames}
              isFavorite={isFavorite(pokemon)}
              onToggleFavorite={() => {
                if (isFavorite(pokemon)) {
                  handleRemoveFromFavorites(pokemon);
                } else {
                  handleAddToFavorites(pokemon);
                }
              }}
            />
          ))
        ) : (
          <p>No Pokemon found</p>
        )}
      </div>
    </div>
  );
}
