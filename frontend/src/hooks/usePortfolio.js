import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import portfolioService from '../services/portfolioService';

export function usePortfolio() {
  const queryClient = useQueryClient();

  const portfolioQuery = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data } = await portfolioService.getPortfolio();
      return data.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data) => portfolioService.addInvestment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Investment added');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add investment');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => portfolioService.updateInvestment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Investment updated');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => portfolioService.deleteInvestment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Investment deleted');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete');
    },
  });

  return {
    portfolio: portfolioQuery.data || [],
    isLoading: portfolioQuery.isLoading,
    isError: portfolioQuery.isError,
    addInvestment: addMutation.mutate,
    updateInvestment: updateMutation.mutate,
    deleteInvestment: deleteMutation.mutate,
    isAdding: addMutation.isPending,
  };
}

export default usePortfolio;
