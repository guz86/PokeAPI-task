import { Pokemon } from '@/features/types';
import Link from 'next/link';
import usePokemonCardLogic from '../logic/pokemonCard.logic';

interface PokemonCardUIProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardUIProps> = ({ pokemon }) => {
  const { isFavorite, handleAddToFavorites, handleRemoveFromFavorites } =
    usePokemonCardLogic({ pokemon });

  return (
    <div className='p-5 flex flex-col gap-4 items-center bg-gray-800 h-80 w-80'>
      <Link href={`/pokemon/${pokemon.name}`}>
        <h2 className='text-2xl font-semibold capitalize text-gray-400'>
          {pokemon.name}
        </h2>
        {pokemon.sprite && (
          <img src={pokemon.sprite} alt={pokemon.name} width='150px' />
        )}
        <div className='text-2xl font-semibold capitalize text-gray-500'>
          Type: {pokemon.typeNames?.join(', ') || 'Unknown'}
        </div>
      </Link>
      {isFavorite ? (
        <button onClick={handleRemoveFromFavorites}>
          Remove from Favorites
        </button>
      ) : (
        <button onClick={handleAddToFavorites}>Add to Favorites</button>
      )}
    </div>
  );
};

export default PokemonCard;
