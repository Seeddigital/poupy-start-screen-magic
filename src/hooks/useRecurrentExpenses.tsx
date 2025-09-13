import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { otpService } from '@/services/otpService';
import { toast } from '@/hooks/use-toast';

export interface RecurrentExpense {
  id: number;
  description: string;
  amount: number;
  frequency: 'monthly'; // Only monthly frequency supported
  start_date: string;
  status: 'active'; // Always active
  next_charge_date: string;
  expense_category_id: number;
  expenseable_type: string;
  expenseable_id: number;
  category?: {
    id: number;
    name: string;
    color: string;
    icon?: string;
  };
  account?: {
    id: number;
    name: string;
    type: string;
  };
}

const CACHE_KEY = 'recurrentExpenses';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useRecurrentExpenses = () => {
  const [recurrentExpenses, setRecurrentExpenses] = useState<RecurrentExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { session } = useAuth();

  const loadFromCacheOrFetch = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      // Try to load from cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        if (now - timestamp < CACHE_DURATION) {
          setRecurrentExpenses(data);
          setLoading(false);
          return;
        }
      }

      // Fetch from API
      await fetchRecurrentExpenses();
    } catch (error) {
      console.error('Error loading recurrent expenses:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar despesas recorrentes",
        variant: "destructive"
      });
      setLoading(false);
    }
  }, [session?.access_token]);

  const fetchRecurrentExpenses = useCallback(async () => {
    if (!session?.access_token) return;

    try {
      const [recurrentResult, categoriesResult, accountsResult] = await Promise.all([
        otpService.getRecurrentExpenses(session.access_token),
        otpService.getCategories(session.access_token),
        otpService.getExpenses(session.access_token) // Using expenses endpoint to get accounts data
      ]);

      if (recurrentResult.success && recurrentResult.recurrentExpenses) {
        // Enrich recurrent expenses with category and account info
        const enrichedExpenses = recurrentResult.recurrentExpenses.map((expense: any) => ({
          id: expense.id,
          description: expense.description,
          amount: expense.amount,
          frequency: expense.frequency,
          start_date: expense.start_date,
          end_date: expense.end_date,
          status: expense.status,
          next_charge_date: expense.next_charge_date,
          expense_category_id: expense.expense_category_id,
          expenseable_type: expense.expenseable_type,
          expenseable_id: expense.expenseable_id,
          category: categoriesResult.success && categoriesResult.categories 
            ? categoriesResult.categories.find((cat: any) => cat.category_id === expense.expense_category_id)
            : undefined,
          account: {
            id: expense.expenseable_id,
            name: expense.expenseable_type === 'conta_corrente' ? 'Conta Corrente' :
                  expense.expenseable_type === 'cartao_credito' ? 'Cartão de Crédito' :
                  expense.expenseable_type === 'poupanca' ? 'Poupança' : 'Conta',
            type: expense.expenseable_type
          }
        }));

        setRecurrentExpenses(enrichedExpenses);
        
        // Cache the data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: enrichedExpenses,
          timestamp: Date.now()
        }));
      } else {
        console.error('Failed to fetch recurrent expenses:', recurrentResult.error);
        toast({
          title: "Erro", 
          description: recurrentResult.error || "Erro ao carregar despesas recorrentes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching recurrent expenses:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar despesas recorrentes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [session?.access_token]);

  const pullToRefresh = useCallback(async () => {
    setRefreshing(true);
    localStorage.removeItem(CACHE_KEY);
    await fetchRecurrentExpenses();
  }, [fetchRecurrentExpenses]);

  const refetch = useCallback(() => {
    setLoading(true);
    localStorage.removeItem(CACHE_KEY);
    fetchRecurrentExpenses();
  }, [fetchRecurrentExpenses]);

  useEffect(() => {
    loadFromCacheOrFetch();
  }, [loadFromCacheOrFetch]);

  return {
    recurrentExpenses,
    loading,
    refreshing,
    pullToRefresh,
    refetch
  };
};