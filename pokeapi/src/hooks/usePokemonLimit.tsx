import { useEffect, useState } from 'react';

const usePokemonLimit = () => {
  const POKEMON_HEIGHT = 300;
  const POKEMON_WIDTH = 300;
  const HEIGHT_MULTIPLIER = 1.3;

  const calculateInitialLimit = () => {
    if (typeof window === 'undefined') return 0;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const blocksInRow = Math.floor(screenWidth / POKEMON_WIDTH);
    const blocksInColumn = Math.ceil((screenHeight * HEIGHT_MULTIPLIER) / POKEMON_HEIGHT);

    return blocksInRow * blocksInColumn;
  };

  const [initialLimit, setInitialLimit] = useState<number>(calculateInitialLimit());

  useEffect(() => {
    const updateLimit = () => {
      const newLimit = calculateInitialLimit();
      setInitialLimit(newLimit);
    };

    updateLimit(); 

    window.addEventListener('resize', updateLimit); 

    return () => {
      window.removeEventListener('resize', updateLimit);
    };
  }, []);

  return initialLimit; 
};

export default usePokemonLimit;
