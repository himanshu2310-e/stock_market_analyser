import { useQuery } from '@tanstack/react-query';
import marketService from '../services/marketService';

export function useMarketData() {
  const overviewQuery = useQuery({
    queryKey: ['marketOverview'],
    queryFn: async () => {
      const { data } = await marketService.getOverview();
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    marketData: overviewQuery.data || { gainers: [], losers: [], active: [] },
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    error: overviewQuery.error,
    refetch: overviewQuery.refetch,
  };
}

export default useMarketData;
