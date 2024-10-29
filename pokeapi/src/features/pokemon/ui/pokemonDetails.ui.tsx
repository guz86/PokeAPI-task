import { PokemonDetails } from '../types/pokemonDetails.types';

interface PokemonDetailsProps {
  pokemon: PokemonDetails;
}

const PokemonDetailsUI: React.FC<PokemonDetailsProps> = ({ pokemon }) => {
  return (
    <div className='bg-gray-800 rounded-lg shadow-lg max-w-full w-full sm:max-w-[600px] overflow-hidden'>
      <h1 className='p-5 text-3xl font-bold text-white capitalize'>
        Name: {pokemon.name}
      </h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className='w-auto h-56 object-cover mx-auto'
      />
      <div className='p-6'>
        <p className='text-gray-300'>Weight: {pokemon.weight} hg</p>
        <p className='text-gray-300'>Height: {pokemon.height} dm</p>
        <p className='text-gray-300'>
          Base Experience: {pokemon.base_experience}
        </p>
        <h2 className='mt-4 text-xl font-semibold text-gray-200'>Abilities:</h2>
        <ul className='list-disc list-inside mt-2 text-gray-300'>
          {pokemon.abilities.map((ability) => (
            <li key={ability.ability.name}>{ability.ability.name}</li>
          ))}
        </ul>
        <h2 className='mt-4 text-xl font-semibold text-gray-200'>Moves:</h2>
        <p className='text-gray-300'>
          {pokemon.moves.map((move) => move.move.name).join(', ')}
        </p>
      </div>
    </div>
  );
};

export default PokemonDetailsUI;
