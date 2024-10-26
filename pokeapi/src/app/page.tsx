"use client";

import { useCallback, useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
  sprite?: string;
  typeName?: string;
}

interface PokemonType {
  slot: number;
  type: {
    name: string;
  };
}

interface PokemonDetails {
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pokemonHeight = 180;

  const calculateInitialLimit = () => {
    const screenHeight = window.innerHeight;
    const limit = Math.ceil((screenHeight * 1.2) / pokemonHeight);
    return Math.ceil(limit / 10) * 10;
  };

  const fetchPokemons = async (limit: number, currentOffset: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();

      const pokemonsWithDetails = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const details = await fetchPokemonDetails(pokemon.url);
          return { ...pokemon, ...details };
        })
      );

      setPokemons((prev) => {
        const newPokemons = pokemonsWithDetails.filter(
          (pokemon: Pokemon & { sprite: string; typeName: string | null }) => !prev.some((p) => p.url === pokemon.url)
        );
        return [...prev, ...newPokemons];
      });

      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPokemonDetails = async (url: string): Promise<{ sprite: string | null; typeName: string | null }> => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error fetching pokemon details");
      }
      const data: PokemonDetails = await response.json();

      const sprite = data.sprites.front_default || 'file.svg';
      const typeName = data.types[0]?.type.name || null;

      return { sprite, typeName };
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
      return { sprite: 'file.svg', typeName: null };
    }
  };

  useEffect(() => {
    const initialLimit = calculateInitialLimit();
    fetchPokemons(initialLimit, 0);
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 50 &&
      !isLoading
    ) {
      fetchPokemons(10, offset);
    }
  }, [offset, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="flex flex-col items-center gap-2.5">
      {pokemons.map((pokemon) => (
        <div className="p-10 border-b flex flex-col items-center" key={pokemon.url}>
          <h2 className="text-4xl font-semibold capitalize text-gray-400">{pokemon.name}</h2>
          {pokemon.sprite && <img src={pokemon.sprite} alt={pokemon.name} width='150px' />}
          <div className="capitalize">Type: {pokemon.typeName}</div>
        </div>
      ))}
    </div>
  );
}
