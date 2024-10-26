"use client";

import { useCallback, useEffect, useState } from "react";

interface Pokemon {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pokemonHeight = 50;

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

      setPokemons((prev) => {
        const newPokemons = data.results.filter(
          (pokemon: Pokemon) => !prev.some((p) => p.url === pokemon.url)
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
    <>
      {pokemons.map((pokemon) => (
        <div className="p-2 border rounded shadow-lg" key={pokemon.url}>
          {pokemon.name}
        </div>
      ))}
    </>
  );
}
