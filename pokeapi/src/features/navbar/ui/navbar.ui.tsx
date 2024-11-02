'use client';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className='flex justify-between items-center w-full mb-4 p-4 bg-gray-700'>
      <Link href='/'>
        <h1 className='text-2xl font-bold text-white cursor-pointer'>
          Pokedex
        </h1>
      </Link>
      <Link href='/favorites'>
        <button className='px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 transition'>
          Favorites
        </button>
      </Link>
    </div>
  );
};

export default Navbar;
