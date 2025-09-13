
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

// Color mapping for categories
const categoryColors: { [key: string]: string } = {
  'Alimentação': '#A8E202',
  'Mercado': '#8B5CF6',  
  'Pet': '#F59E0B',
  'Transporte': '#EF4444',
  'Lazer e Entretenimento': '#10B981',
  'Moradia': '#3B82F6',
  'Saúde e Bem-Estar': '#EC4899',
  'Outros': '#6B7280',
  'Eventuais': '#84CC16',
  'Compras e Vestuário': '#F97316',
  'Educação': '#8B5CF6',
  'Família e Crianças': '#06B6D4',
  'Finanças e Investimentos': '#10B981',
  'Equipamentos para Casa': '#64748B'
};

// Function to generate consistent color for category
const getCategoryColor = (categoryName: string, categoryId: number): string => {
  if (categoryColors[categoryName]) {
    return categoryColors[categoryName];
  }
  
  // Generate consistent color based on category ID
  const colors = [
    '#A8E202', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981', 
    '#3B82F6', '#EC4899', '#6B7280', '#84CC16', '#F97316',
    '#06B6D4', '#64748B', '#F472B6', '#22D3EE', '#FDE047'
  ];
  
  return colors[categoryId % colors.length];
};

export const useTransactions = () => {
  const { user, session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Early return if auth context is not ready
  const authLoading = !user && !session;

  // Cache keys - only create if user exists
  const TRANSACTIONS_CACHE_KEY = user ? `transactions_${user.id}` : null;
  const CATEGORIES_CACHE_KEY = user ? `categories_${user.id}` : null;
  const CACHE_TIMESTAMP_KEY = user ? `cache_timestamp_${user.id}` : null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Return safe defaults if auth is loading
  if (authLoading) {
    return {
      transactions: [],
      categories: [],
      monthlyExpenses: 0,
      loading: true,
      refreshing: false,
      pullToRefresh: async () => {},
      refetch: () => {}
    };
  }

  useEffect(() => {
    if (user && session && !authLoading) {
      loadFromCacheOrFetch();
    }
  }, [user, session, authLoading]);

  // Load data from cache first, then fetch if needed
  const loadFromCacheOrFetch = async () => {
    try {
      const cachedTransactions = localStorage.getItem(TRANSACTIONS_CACHE_KEY);
      const cachedCategories = localStorage.getItem(CATEGORIES_CACHE_KEY);
      const cacheTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
      
      const now = Date.now();
      const isExpired = !cacheTimestamp || (now - parseInt(cacheTimestamp)) > CACHE_DURATION;

      if (cachedTransactions && cachedCategories && !isExpired) {
        // Load from cache
        console.log('Loading data from cache');
        const transactionsData = JSON.parse(cachedTransactions);
        const categoriesData = JSON.parse(cachedCategories);
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
        
        // Calculate monthly expenses from cached data
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTotal = transactionsData
          .filter((t: any) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   Number(t.amount) < 0;
          })
          .reduce((sum: number, t: any) => sum + Math.abs(Number(t.amount)), 0);
        
        setMonthlyExpenses(monthlyTotal);
        setLoading(false);
      } else {
        // Cache expired or doesn't exist, fetch from API
        console.log('Cache expired or missing, fetching from API');
        await fetchDataFromAPI();
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
      await fetchDataFromAPI();
    }
  };

  // Fetch data from API and update cache
  const fetchDataFromAPI = async () => {
    setLoading(true);
    await fetchTransactions();
    // Categories will be fetched in the useEffect when transactions change
  };

  // Pull to refresh function
  const pullToRefresh = async () => {
    setRefreshing(true);
    try {
      // Clear cache to force fresh data
      localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      
      await fetchDataFromAPI();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [user, transactions]);

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
          amount: Number(expense.amount),
          type: (Number(expense.amount) > 0 ? 'income' : 'expense') as 'expense' | 'income' | 'transfer',
          transaction_date: expense.due_at || expense.created_at, // Usar due_at como data principal
          category_id: expense.expense_category_id,
          account_id: expense.expenseable?.id || 1,
          categories: expense.category ? {
            name: expense.category.name,
            color: getCategoryColor(expense.category.name, expense.expense_category_id),
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
        
        // Cache the transactions
        localStorage.setItem(TRANSACTIONS_CACHE_KEY, JSON.stringify(enrichedTransactions));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        
        // Calculate monthly expenses
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTotal = enrichedTransactions
          .filter((t) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   Number(t.amount) < 0; // Only count negative amounts (expenses)
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
      if (!session?.access_token) {
        console.log('No access token available for categories');
        return;
      }

      console.log('Fetching categories from API for user:', user?.full_name);
      console.log('Current transactions for calculation:', transactions);
      
      const result = await otpService.getCategories(session.access_token);
      
      if (result.success && result.categories) {
        console.log('API categories loaded:', result.categories);
        
        // Calculate category totals from all transactions (not just current month)
        
        // Use the transactions that are already loaded
        const categoryTotals = transactions
          .filter(t => Number(t.amount) < 0) // Only count negative amounts (expenses)
          .reduce((acc, t) => {
            // Match by category_id from transaction with id from categories
            const categoryId = Number(t.category_id);
            acc[categoryId] = (acc[categoryId] || 0) + Math.abs(Number(t.amount));
            return acc;
          }, {} as Record<number, number>);

        console.log('Category totals calculated:', categoryTotals);

        const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
        console.log('Total expenses:', totalExpenses);

        const categoriesWithAmounts = result.categories.map((cat: any) => ({
          ...cat,
          cat_id: Number(cat.id),
          name: cat.name,
          color: cat.color || getCategoryColor(cat.name, Number(cat.id)),
          icon: categoryIcons[cat.name] || '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png',
          amount: categoryTotals[Number(cat.id)] || 0,
          percentage: totalExpenses > 0 ? Math.round((categoryTotals[Number(cat.id)] || 0) / totalExpenses * 100) : 0
        }))
        .filter((cat: any) => cat.name && cat.name.trim() !== '') // Show all categories with valid names, regardless of spending
        .sort((a: any, b: any) => {
          // Sort categories with spending first (by amount descending), then categories without spending alphabetically
          if (a.amount > 0 && b.amount === 0) return -1;
          if (a.amount === 0 && b.amount > 0) return 1;
          if (a.amount > 0 && b.amount > 0) return b.amount - a.amount;
          return a.name.localeCompare(b.name);
        });

        console.log('Categories with amounts:', categoriesWithAmounts);
        setCategories(categoriesWithAmounts);
        
        // Cache the categories
        localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify(categoriesWithAmounts));
      } else {
        console.error('Failed to fetch categories:', result.error);
        // Fallback to mock categories
        console.log('Falling back to mock categories');
        const userCategories = MOCK_CATEGORIES.filter(c => c.user_id === user?.id);
        
        const userTransactions = MOCK_TRANSACTIONS.filter(t => 
          t.user_id === user?.id && t.type === 'expense'
        );

        const categoryTotals = userTransactions
          .reduce((acc, t) => {
            const categoryId = Number(t.category_id);
            acc[categoryId] = (acc[categoryId] || 0) + Math.abs(Number(t.amount));
            return acc;
          }, {} as Record<number, number>);

        const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

        const categoriesWithAmounts = userCategories.map(cat => ({
          ...cat,
          cat_id: Number(cat.category_id),
          icon: categoryIcons[cat.name] || cat.icon,
          amount: categoryTotals[Number(cat.category_id)] || 0,
          percentage: totalExpenses > 0 ? Math.round((categoryTotals[Number(cat.category_id)] || 0) / totalExpenses * 100) : 0
        }))
        .filter(cat => cat.name && cat.name.trim() !== '') // Show all categories with valid names
        .sort((a, b) => {
          // Sort categories with spending first (by amount descending), then categories without spending alphabetically
          if (a.amount > 0 && b.amount === 0) return -1;
          if (a.amount === 0 && b.amount > 0) return 1;
          if (a.amount > 0 && b.amount > 0) return b.amount - a.amount;
          return a.name.localeCompare(b.name);
        });

        setCategories(categoriesWithAmounts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock categories due to error');
      const userCategories = MOCK_CATEGORIES.filter(c => c.user_id === user?.id);
      setCategories(userCategories.map(cat => ({
        ...cat,
        cat_id: Number(cat.category_id),
        icon: categoryIcons[cat.name] || cat.icon,
        amount: 0,
        percentage: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    categories,
    monthlyExpenses,
    loading,
    refreshing,
    pullToRefresh,
    refetch: async () => {
      console.log('Refetching data - clearing cache first');
      // Clear cache to ensure fresh data
      localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
      localStorage.removeItem(CATEGORIES_CACHE_KEY);
      localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      
      // Fetch fresh data
      await fetchDataFromAPI();
    }
  };
};
