'use client';

import Navbar from '@/features/navbar/ui/navbar.ui';
import PokemonList from '@/features/pokemonList/ui/pokemonList.ui';

const Home = () => {
  return (
    <div className='flex flex-col items-center gap-2.5'>
      <Navbar />
      <PokemonList />
    </div>
  );
};

export default Home;
