'use client';

import { capitalize } from '../logic/formatters.logic';
import { PokemonCardProps } from '../types/pokemon.types';

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className='p-4'>
      <h2 className='text-lg font-semibold mt-2'>{capitalize(pokemon.name)}</h2>
    </div>
  );
};

export default PokemonCard;
