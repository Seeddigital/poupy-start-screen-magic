
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

// Icon mapping for categories
const categoryIcons: { [key: string]: string } = {
  'Alimentação': '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png',
  'Família e Crianças': '/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png',
  'Cuidados com saúde': '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png',
  'Lazer e Bem estar': '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
  'Moradia': '/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png',
  'Transporte': '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
  'Pet': '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png',
  'Outros': '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png',
  'Mercado': '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png',
  'Gasolina': '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
  'Cinema': '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
  'Material de escritório': '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png',
  'Ração para o gato': '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png'
};

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
      console.log('Fetching transactions for user:', user?.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories:category_id (name, color, icon),
          accounts:account_id (name, type)
        `)
        .eq('user_id', user?.id)
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
        account_id: transaction.account_id as number,
        categories: transaction.categories ? {
          ...transaction.categories,
          icon: categoryIcons[transaction.categories.name] || transaction.categories.icon
        } : undefined
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
      console.log('Fetching categories for user:', user?.id);
      
      // Fetch only categories that belong to the current user
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      console.log('Fetched user categories:', data);
      
      // Calculate category totals from transactions
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('amount, category_id, transaction_date, type')
        .eq('type', 'expense')
        .eq('user_id', user?.id);

      console.log('Transaction data for categories:', transactionData);

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

      console.log('Category totals:', categoryTotals);

      const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

      // Use category_id as the key field since that's what's in your database
      const categoriesWithAmounts = (data || []).map(cat => ({
        cat_id: Number(cat.category_id), // Use category_id from database
        name: cat.name,
        color: cat.color,
        icon: categoryIcons[cat.name] || cat.icon,
        amount: categoryTotals[Number(cat.category_id)] || 0,
        percentage: totalExpenses > 0 ? Math.round((categoryTotals[Number(cat.category_id)] || 0) / totalExpenses * 100) : 0
      }));

      console.log('Categories with amounts:', categoriesWithAmounts);
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
