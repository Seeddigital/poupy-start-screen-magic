
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { otpService } from '../services/otpService';
import { 
  MOCK_TRANSACTIONS, 
  MOCK_CATEGORIES, 
  MOCK_ACCOUNTS, 
  MockTransaction, 
  MockCategory, 
  MockAccount 
} from '@/data/mockData';

interface Transaction extends MockTransaction {
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

interface ApiExpense {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  transaction_date: string;
  category_id: number;
  account_id: number;
  categories?: {
    name: string;
    color: string;
    icon?: string;
  };
  accounts?: {
    name: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}

interface Category extends MockCategory {
  cat_id: number;
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
  const { user, session } = useAuth();
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
      if (!session?.access_token) {
        console.log('No access token available');
        return;
      }

      console.log('Fetching expenses from API for user:', user?.full_name);
      
      const result = await otpService.getExpenses(session.access_token);
      
      if (result.success && result.expenses) {
        console.log('API expenses loaded:', result.expenses);
        
        // Transform API expenses to match our transaction format
        const enrichedTransactions: ApiExpense[] = result.expenses.map((expense: any) => ({
          id: expense.id,
          user_id: user?.id || '',
          description: expense.description,
          amount: Math.abs(Number(expense.amount)),
          type: 'expense' as const,
          transaction_date: expense.due_at || expense.created_at,
          category_id: expense.expense_category_id,
          account_id: expense.expenseable?.id || 1,
          categories: expense.category ? {
            name: expense.category.name,
            color: '#8B5CF6',
            icon: categoryIcons[expense.category.name] || '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png'
          } : undefined,
          accounts: expense.expenseable ? {
            name: expense.expenseable.name,
            type: expense.expenseable.brand || 'card'
          } : undefined,
          created_at: expense.created_at,
          updated_at: expense.updated_at
        })).sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        
        setTransactions(enrichedTransactions as Transaction[]);
        
        // Calculate monthly expenses
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTotal = enrichedTransactions
          .filter((t) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   t.type === 'expense';
          })
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        
        console.log('Monthly expenses calculated:', monthlyTotal);
        setMonthlyExpenses(monthlyTotal);
      } else {
        console.error('Failed to fetch expenses:', result.error);
        // Fallback to mock data
        console.log('Falling back to mock data');
        const userTransactions = MOCK_TRANSACTIONS.filter(t => t.user_id === user?.id);
        
        const enrichedTransactions = userTransactions.map(transaction => {
          const category = MOCK_CATEGORIES.find(c => c.category_id === transaction.category_id);
          const account = MOCK_ACCOUNTS.find(a => a.id === transaction.account_id);
          
          return {
            ...transaction,
            categories: category ? {
              name: category.name,
              color: category.color,
              icon: categoryIcons[category.name] || category.icon
            } : undefined,
            accounts: account ? {
              name: account.name,
              type: account.type
            } : undefined
          };
        }).sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        
        setTransactions(enrichedTransactions);
        setMonthlyExpenses(0);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      const userTransactions = MOCK_TRANSACTIONS.filter(t => t.user_id === user?.id);
      setTransactions(userTransactions);
      setMonthlyExpenses(0);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching mock categories for user:', user?.id);
      
      // Filter categories for current user
      const userCategories = MOCK_CATEGORIES.filter(c => c.user_id === user?.id);
      
      // Calculate category totals from transactions
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const userTransactions = MOCK_TRANSACTIONS.filter(t => 
        t.user_id === user?.id && t.type === 'expense'
      );

      const categoryTotals = userTransactions
        .filter(t => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        })
        .reduce((acc, t) => {
          const categoryId = Number(t.category_id);
          acc[categoryId] = (acc[categoryId] || 0) + Math.abs(Number(t.amount));
          return acc;
        }, {} as Record<number, number>);

      console.log('Mock category totals:', categoryTotals);

      const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

      const categoriesWithAmounts = userCategories.map(cat => ({
        ...cat,
        cat_id: Number(cat.category_id),
        icon: categoryIcons[cat.name] || cat.icon,
        amount: categoryTotals[Number(cat.category_id)] || 0,
        percentage: totalExpenses > 0 ? Math.round((categoryTotals[Number(cat.category_id)] || 0) / totalExpenses * 100) : 0
      }))
      .filter(cat => cat.amount > 0) // Only show categories with transactions
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending

      console.log('Mock categories with amounts:', categoriesWithAmounts);
      setCategories(categoriesWithAmounts);
    } catch (error) {
      console.error('Error fetching mock categories:', error);
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
