"use client";

import { useCallback, useEffect, useState } from "react";

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
  sprite?: string;
  typeNames?: string[];
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const pokemonHeight = 180;

  const calculateInitialLimit = () => {
    const screenHeight = window.innerHeight;
    const limit = Math.ceil((screenHeight * 1.2) / pokemonHeight);
    return Math.ceil(limit / 10) * 10;
  };

  const fetchAllPokemonNames = async () => {
    try {
      const responseCount = await fetch("https://pokeapi.co/api/v2/pokemon");
      if (!responseCount.ok) throw new Error("Error fetching total count");
      const dataCount = await responseCount.json();
      const totalCount = dataCount.count;

      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=${totalCount}`);
      if (!response.ok) throw new Error("Error fetching response data");
      const data = await response.json();

      const allPokemon: { name: string; url: string }[] = data.results.map((pokemon: Pokemon) => ({
        name: pokemon.name,
        url: pokemon.url
      }));

      setAllPokemon(allPokemon);
      console.log(allPokemon);
    } catch (error) {
      console.log("Error fetching all Pokemon names:", error);
    }
  };

  const fetchPokemons = async (limit: number, currentOffset: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`);
      if (!response.ok) throw new Error("Error fetching data");
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

  const fetchPokemonDetails = async (url: string): Promise<{ sprite: string | null; typeNames: string[] }> => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error fetching pokemon details");

      const data: PokemonDetails = await response.json();
      const sprite = data.sprites.front_default || "file.svg";
      const typeNames = data.types.map((typeObj: PokemonType) => typeObj.type.name);

      return { sprite, typeNames };
    } catch (error) {
      console.error("Error fetching pokemon details:", error);
      return { sprite: "file.svg", typeNames: [] };
    }
  };

  useEffect(() => {
    fetchAllPokemonNames();
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

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center gap-2.5">
<input
  type="text"
  placeholder="Search Pokemon"
  className="p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-md hover:shadow-lg text-black"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      {filteredPokemons.length > 0 ? (
        filteredPokemons.map((pokemon) => (
          <div className="p-10 border-b flex flex-col items-center" key={pokemon.url}>
            <h2 className="text-4xl font-semibold capitalize text-gray-400">{pokemon.name}</h2>
            {pokemon.sprite && <img src={pokemon.sprite} alt={pokemon.name} width="250px" />}
            <div className="text-2xl font-semibold capitalize text-gray-500">
              Type: {pokemon.typeNames?.join(', ') || 'Unknown'}
            </div>
          </div>
        ))
      ) : (
        <p>No Pokemon found</p>
      )}
    </div>
  );
}
