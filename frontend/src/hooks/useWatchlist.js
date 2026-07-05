import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import watchlistService from '../services/watchlistService';

export function useWatchlist() {
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const { data } = await watchlistService.getWatchlist();
      return data.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data) => watchlistService.addToWatchlist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Added to watchlist');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add');
    },
  });

  const togglePinMutation = useMutation({
    mutationFn: (id) => watchlistService.togglePin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id) => watchlistService.removeFromWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      toast.success('Removed from watchlist');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to remove');
    },
  });

  return {
    watchlist: watchlistQuery.data || [],
    isLoading: watchlistQuery.isLoading,
    isError: watchlistQuery.isError,
    addToWatchlist: addMutation.mutate,
    togglePin: togglePinMutation.mutate,
    removeFromWatchlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
  };
}

export default useWatchlist;
