'use client';

import Link from 'next/link';

interface Pokemon {
  name: string;
  url: string;
  sprite?: string | null;
  typeNames?: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const PokemonCard = ({
  name,
  sprite,
  typeNames,
  isFavorite,
  onToggleFavorite,
}: Pokemon) => {
  return (
    <div className='p-5 flex flex-col gap-4 items-center bg-gray-800 h-80 w-80'>
      <Link href={`/pokemon/${name}`}>
        <h2 className='text-2xl font-semibold capitalize text-gray-400'>
          {name}
        </h2>
        {sprite && <img src={sprite} alt={name} width='150px' />}
        <div className='text-2xl font-semibold capitalize text-gray-500'>
          Type: {typeNames?.join(', ') || 'Unknown'}
        </div>
      </Link>
      <button
        onClick={onToggleFavorite}
        className='mb-4 px-4 py-2 text-sm text-black bg-gray-400 rounded hover:bg-gray-500 transition'
      >
        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
      </button>
    </div>
  );
};

export default PokemonCard;
