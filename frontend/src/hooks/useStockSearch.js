import { useQuery } from '@tanstack/react-query';
import stockService from '../services/stockService';
import useDebounce from './useDebounce';

/**
 * Custom hook for stock search with debouncing.
 * Only fires the query when the debounced term is ≥ 1 character.
 */
export function useStockSearch(searchTerm) {
  const debouncedTerm = useDebounce(searchTerm, 400);

  const query = useQuery({
    queryKey: ['stockSearch', debouncedTerm],
    queryFn: async () => {
      const { data } = await stockService.search(debouncedTerm);
      return data.data;
    },
    enabled: debouncedTerm.length >= 1,
    staleTime: 60 * 1000,
  });

  return {
    results: query.data || [],
    isLoading: query.isLoading && debouncedTerm.length >= 1,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useStockSearch;
