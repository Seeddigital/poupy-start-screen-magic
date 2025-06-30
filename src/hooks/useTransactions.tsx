
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: number;
  account_id: number;
  transaction_date: string;
  notes?: string;
  created_at: string;
  categories?: {
    name: string;
    color: string;
    icon?: string;
  };
  accounts?: {
    name: string;
    type: string;
  };
}

interface Category {
  cat_id: number;
  name: string;
  color: string;
  icon?: string;
  amount: number;
  percentage: number;
}

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (name, color, icon),
          accounts:account_id (name, type)
        `)
        .order('transaction_date', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      console.log('Fetched transactions:', data);
      
      const typedTransactions = (data || []).map(transaction => ({
        ...transaction,
        type: transaction.type as 'income' | 'expense' | 'transfer',
        category_id: transaction.category_id as number,
        account_id: transaction.account_id as number
      }));
      
      setTransactions(typedTransactions);
      
      // Calculate monthly expenses
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyTotal = typedTransactions
        .filter(t => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear &&
                 t.type === 'expense';
        })
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      
      setMonthlyExpenses(monthlyTotal);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      console.log('Fetched categories:', data);
      
      // Calculate category totals from transactions
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('amount, category_id, transaction_date, type')
        .eq('type', 'expense');

      const categoryTotals = (transactionData || [])
        .filter(t => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        })
        .reduce((acc, t) => {
          if (t.category_id) {
            const categoryId = Number(t.category_id);
            acc[categoryId] = (acc[categoryId] || 0) + Math.abs(Number(t.amount));
          }
          return acc;
        }, {} as Record<number, number>);

      const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

      const categoriesWithAmounts = (data || []).map(cat => ({
        cat_id: Number(cat.cat_id),
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        amount: categoryTotals[Number(cat.cat_id)] || 0,
        percentage: totalExpenses > 0 ? Math.round((categoryTotals[Number(cat.cat_id)] || 0) / totalExpenses * 100) : 0
      }));

      setCategories(categoriesWithAmounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    categories,
    monthlyExpenses,
    loading,
    refetch: () => {
      fetchTransactions();
      fetchCategories();
    }
  };
};
