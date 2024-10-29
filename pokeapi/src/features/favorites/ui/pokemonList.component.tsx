'use client';
import { PokemonListProps } from '../types/pokemon.types';
import PokemonCard from './pokemonCard.component';

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  return (
    <div className='flex flex-wrap gap-4'>
      {pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
