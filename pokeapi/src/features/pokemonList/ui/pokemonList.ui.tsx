'use client';

import { FC } from 'react';
import SearchBar from '@/features/searchBar/ui/searchBar.ui';
import TypeSelect from '@/features/typeSelect/ui/typeSelect.ui';
import PokemonCard from '@/features/pokemonCard/PokemonCard';
import usePokemonListLogic from '../logic/pokemonList.logic';

const PokemonList: FC = () => {
  const {
    pokemons,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    types,
  } = usePokemonListLogic();

  return (
    <div className='flex flex-col items-center gap-2.5'>
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
};

export default PokemonList;
