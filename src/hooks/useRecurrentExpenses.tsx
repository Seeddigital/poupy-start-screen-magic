import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { otpService } from '@/services/otpService';
import { toast } from '@/hooks/use-toast';

export interface RecurrentExpense {
  id: number;
  description: string;
  amount: number;
  start_date: string;
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
        const enrichedExpenses = recurrentResult.recurrentExpenses.map((expense: any) => {
          // Calculate next charge date based on createOnDom if not present
          let nextChargeDate = expense.next_charge_date;
          
          console.log('Processing expense:', expense.description, {
            next_charge_date: expense.next_charge_date,
            createOnDom: expense.createOnDom,
            start_date: expense.start_date
          });
          
          if (!nextChargeDate && expense.createOnDom) {
            const today = new Date();
            const currentDay = today.getDate();
            const targetDay = parseInt(expense.createOnDom);
            
            // Validate targetDay is a valid day of month
            if (targetDay >= 1 && targetDay <= 31) {
              // Create next charge date
              let nextDate = new Date(today.getFullYear(), today.getMonth(), targetDay);
              
              // If the day has already passed this month, move to next month
              if (currentDay >= targetDay) {
                nextDate = new Date(today.getFullYear(), today.getMonth() + 1, targetDay);
              }
              
              nextChargeDate = nextDate.toISOString().split('T')[0];
              console.log('Calculated nextChargeDate:', nextChargeDate);
            }
          }
          
          // If still no valid date, try to use start_date as fallback
          if (!nextChargeDate && expense.start_date) {
            const startDate = new Date(expense.start_date);
            if (!isNaN(startDate.getTime())) {
              // Add one month to start date as approximation
              const nextMonth = new Date(startDate);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              nextChargeDate = nextMonth.toISOString().split('T')[0];
              console.log('Used start_date fallback:', nextChargeDate);
            }
          }
          
          console.log('Final nextChargeDate:', nextChargeDate);
          
          return {
            id: expense.id,
            description: expense.description,
            amount: expense.amount,
            start_date: expense.start_date,
            next_charge_date: nextChargeDate,
            expense_category_id: expense.expense_category_id,
            expenseable_type: expense.expenseable_type,
            expenseable_id: expense.expenseable_id,
            createOnDom: expense.createOnDom,
            category: categoriesResult.success && categoriesResult.categories 
              ? categoriesResult.categories.find((cat: any) => cat.id === expense.expense_category_id || cat.category_id === expense.expense_category_id)
              : undefined,
            account: {
              id: expense.expenseable_id,
              name: expense.expenseable_type === 'conta_corrente' ? 'Conta Corrente' :
                    expense.expenseable_type === 'cartao_credito' ? 'Cartão de Crédito' :
                    expense.expenseable_type === 'poupanca' ? 'Poupança' : 'Conta',
              type: expense.expenseable_type
            }
          };
        });

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