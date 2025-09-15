
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
  isRecurrent?: boolean;
  recurrentId?: number;
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

// Default icon for categories (removed all lovable-uploads references)
const getDefaultCategoryIcon = (categoryName: string): string => {
  // Return generic local icon or empty string - icons will be handled by components
  return '/icon-192.png';
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
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // Check if auth is ready
  const authLoading = !user && !session;

  // Cache keys - only create if user exists
  const TRANSACTIONS_CACHE_KEY = user ? `transactions_${user.id}` : null;
  const CATEGORIES_CACHE_KEY = user ? `categories_${user.id}` : null;
  const CACHE_TIMESTAMP_KEY = user ? `cache_timestamp_${user.id}` : null;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (user && session && !authLoading) {
      loadFromCacheOrFetch();
    } else {
      // If auth is not ready, set loading to false to avoid infinite loading
      setLoading(false);
    }
  }, [user, session, authLoading]);

  // Load data from cache first, then fetch if needed
  const loadFromCacheOrFetch = async () => {
    try {
      // Return early if cache keys are null (user not loaded)
      if (!TRANSACTIONS_CACHE_KEY || !CATEGORIES_CACHE_KEY || !CACHE_TIMESTAMP_KEY) {
        await fetchDataFromAPI();
        return;
      }

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
        
        // Apply the same filtering logic when loading from cache
        const now = new Date();
        const currentDay = now.getDate();
        
        const filtered = transactionsData.filter((transaction: any) => {
          // Keep all regular transactions
          if (!transaction.isRecurrent) return true;
          
          // For recurrent transactions, check if they should have been charged
          // Use createOnDom if available, otherwise fall back to date comparison
          if (transaction.createOnDom) {
            return transaction.createOnDom <= currentDay;
          }
          
          // Fallback for older cached data without createOnDom
          const chargeDate = transaction.nextChargeDate 
            ? new Date(transaction.nextChargeDate)
            : new Date(transaction.transaction_date);
          
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const chargeDateOnly = new Date(chargeDate.getFullYear(), chargeDate.getMonth(), chargeDate.getDate());
          return chargeDateOnly <= today;
        });
        
        console.log('Filtered transactions from cache:', filtered);
        setFilteredTransactions(filtered);
        
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
      // Clear cache to force fresh data (only if keys exist)
      if (TRANSACTIONS_CACHE_KEY) localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
      if (CATEGORIES_CACHE_KEY) localStorage.removeItem(CATEGORIES_CACHE_KEY);
      if (CACHE_TIMESTAMP_KEY) localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      
      // Fetch fresh data only if user is available
      if (user && session && !authLoading) {
        await fetchDataFromAPI();
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Categories will be updated automatically when transactions are processed

  const fetchTransactions = async () => {
    try {
      if (!session?.access_token) {
        console.log('No access token available');
        return;
      }

      console.log('Fetching expenses and recurrent expenses from API for user:', user?.full_name);
      
      // Fetch both regular transactions and recurrent expenses
      const [expensesResult, recurrentResult] = await Promise.all([
        otpService.getExpenses(session.access_token),
        otpService.getRecurrentExpenses(session.access_token)
      ]);
      
      if (expensesResult.success && expensesResult.expenses) {
        console.log('API expenses loaded:', expensesResult.expenses);
        
        // Transform API expenses to match our transaction format
        const enrichedTransactions: ApiExpense[] = expensesResult.expenses.map((expense: any) => ({
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
            icon: getDefaultCategoryIcon(expense.category.name)
          } : undefined,
          accounts: expense.expenseable ? {
            name: expense.expenseable.name,
            type: expense.expenseable.brand || 'card'
          } : undefined,
          created_at: expense.created_at,
          updated_at: expense.updated_at,
          isRecurrent: false
        }));

        // Transform recurrent expenses to transaction format if available
        let recurrentTransactions: any[] = [];
        if (recurrentResult.success && recurrentResult.recurrentExpenses) {
          console.log('API recurrent expenses loaded:', recurrentResult.recurrentExpenses);
          
          const now = new Date();
          const currentDay = now.getDate();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          recurrentTransactions = recurrentResult.recurrentExpenses
            .filter((expense: any) => {
              // Only show recurrent expenses that should have been charged by now
              console.log(`Checking recurrent expense ${expense.description}: create_on_dom=${expense.create_on_dom}, current_day=${currentDay}`);
              return expense.create_on_dom <= currentDay;
            })
            .map((expense: any) => {
              // Use create_on_dom to create the transaction date for current month
              const transactionDate = new Date(currentYear, currentMonth, expense.create_on_dom).toISOString();
              
              console.log(`Adding recurrent expense ${expense.description}: create_on_dom=${expense.create_on_dom}, date=${transactionDate}`);
              
              return {
                id: `recurrent_${expense.id}`, // Prefix to avoid ID conflicts
                user_id: user?.id || '',
                description: expense.description,
                amount: expense.amount < 0 ? expense.amount : -Math.abs(expense.amount), // Ensure expenses are negative
                type: 'expense' as const,
                transaction_date: transactionDate,
                category_id: expense.expense_category_id,
                account_id: expense.expenseable?.id || 1,
                categories: expense.category ? {
                  name: expense.category.name,
                  color: getCategoryColor(expense.category.name, expense.expense_category_id),
                  icon: getDefaultCategoryIcon(expense.category.name)
                } : undefined,
                accounts: expense.expenseable ? {
                  name: expense.expenseable.name,
                  type: expense.expenseable.brand || 'card'
                } : undefined,
                created_at: expense.created_at,
                updated_at: expense.updated_at,
                isRecurrent: true,
                recurrentId: expense.id,
                createOnDom: expense.create_on_dom
              };
            });
          
          console.log('Transformed recurrent transactions:', recurrentTransactions);
        }

        // Combine both regular and recurrent transactions and sort by date
        const allTransactions = [...enrichedTransactions, ...recurrentTransactions]
          .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        
        console.log('Combined transactions (regular + recurrent):', allTransactions);
        setTransactions(allTransactions as Transaction[]);
        
        // Since we already filtered recurrent expenses during transformation, 
        // all transactions in allTransactions should be shown
        console.log('All valid transactions (regular + current recurrent):', allTransactions);
        setFilteredTransactions(allTransactions as Transaction[]);
        
        // Calculate monthly expenses from all transactions (already filtered)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTotal = allTransactions
          .filter((t) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   t.type === 'expense' && Number(t.amount) < 0;
          })
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        
        console.log('Monthly expenses calculated:', monthlyTotal);
        setMonthlyExpenses(monthlyTotal);
        
        // Update categories with the same transaction data immediately
        await updateCategoriesWithFilteredData(allTransactions as Transaction[]);
        
        // Set current month transactions (same as allTransactions since we filter during transformation)
        console.log('Current month transactions:', allTransactions);
        setCurrentMonthTransactions(allTransactions as Transaction[]);
        
        // Cache the combined transactions
        localStorage.setItem(TRANSACTIONS_CACHE_KEY, JSON.stringify(allTransactions));
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } else {
        console.error('Failed to fetch expenses:', expensesResult.error);
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
              icon: getDefaultCategoryIcon(category.name)
            } : undefined,
            accounts: account ? {
              name: account.name,
              type: account.type
            } : undefined
          };
        }).sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime());
        
        setTransactions(enrichedTransactions);
        
        // Calculate monthly expenses for fallback scenario
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTotal = userTransactions
          .filter((t) => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   t.type === 'expense' && Number(t.amount) < 0;
          })
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        
        setMonthlyExpenses(monthlyTotal);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to error');
      const userTransactions = MOCK_TRANSACTIONS.filter(t => t.user_id === user?.id);
      setTransactions(userTransactions);
      
      // Calculate monthly expenses for mock data fallback
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const monthlyTotal = userTransactions
        .filter((t) => {
          const transactionDate = new Date(t.transaction_date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear &&
                 t.type === 'expense' && Number(t.amount) < 0;
        })
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      
      setMonthlyExpenses(monthlyTotal);
    }
  };

  const updateCategoriesWithFilteredData = async (filteredData: Transaction[]) => {
    try {
      if (!session?.access_token) {
        console.log('No access token available for categories');
        return;
      }

      console.log('Updating categories with filtered data:', filteredData);
      
      const result = await otpService.getCategories(session.access_token);
      
      if (result.success && result.categories) {
        console.log('API categories loaded:', result.categories);
        
        // Calculate category totals from the provided filtered data
        const categoryTotals = filteredData
          .filter((t: any) => Number(t.amount) < 0) // Only count negative amounts (expenses)
          .reduce((acc: Record<number, number>, t: any) => {
            // Match by category_id from transaction with id from categories
            const categoryId = Number(t.category_id);
            acc[categoryId] = (acc[categoryId] || 0) + Math.abs(Number(t.amount));
            return acc;
          }, {} as Record<number, number>);

        console.log('Category totals calculated:', categoryTotals);

        const totalExpenses = Object.values(categoryTotals).reduce((sum: number, amount: number) => sum + amount, 0);
        console.log('Total expenses:', totalExpenses);

        const categoriesWithAmounts = result.categories.map((cat: any) => ({
          ...cat,
          cat_id: Number(cat.id),
          name: cat.name,
          color: cat.color || getCategoryColor(cat.name, Number(cat.id)),
          icon: getDefaultCategoryIcon(cat.name),
          amount: categoryTotals[Number(cat.id)] || 0,
          percentage: totalExpenses > 0 ? Math.round(((categoryTotals[Number(cat.id)] || 0) / totalExpenses) * 100) : 0
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
        localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
      } else {
        console.error('Failed to fetch categories:', result.error);
      }
    } catch (error) {
      console.error('Error updating categories:', error);
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
        
        // Calculate category totals from filtered transactions (excluding future recurrent)
        
        // This fallback method now uses current filteredTransactions state
        await updateCategoriesWithFilteredData(filteredTransactions);
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
          icon: getDefaultCategoryIcon(cat.name),
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
        icon: getDefaultCategoryIcon(cat.name),
        amount: 0,
        percentage: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions,
    currentMonthTransactions,
    filteredTransactions,
    categories,
    monthlyExpenses,
    loading,
    refreshing,
    pullToRefresh,
    refetch: async () => {
      console.log('Refetching data - clearing cache first');
      // Clear cache to ensure fresh data (only if keys exist)
      if (TRANSACTIONS_CACHE_KEY) localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
      if (CATEGORIES_CACHE_KEY) localStorage.removeItem(CATEGORIES_CACHE_KEY);
      if (CACHE_TIMESTAMP_KEY) localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      
      // Fetch fresh data only if user is available
      if (user && session && !authLoading) {
        await fetchDataFromAPI();
      }
    }
  };
};
