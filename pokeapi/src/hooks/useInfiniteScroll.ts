import { useCallback, useEffect } from 'react';

const useInfiniteScroll = (isLoading: boolean, fetchMore: () => void) => {
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !isLoading
    ) {
      fetchMore();
    }
  }, [isLoading, fetchMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);
};

export default useInfiniteScroll;
