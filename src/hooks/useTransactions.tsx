
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: string;
  account_id: string;
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
  id: string;
  name: string;
  color: string;
  icon?: string;
  amount: number;
  percentage: number;
}

// Dados mockados para demonstração
const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Supermercado Extra',
    amount: 150.00,
    type: 'expense',
    category_id: 'cat1',
    account_id: 'acc1',
    transaction_date: '2024-12-28',
    created_at: '2024-12-28T10:00:00Z',
    categories: { name: 'Supermercado', color: '#3498DB', icon: 'shopping-cart' },
    accounts: { name: 'Conta Corrente', type: 'checking' }
  },
  {
    id: '2',
    description: 'Restaurante',
    amount: 80.00,
    type: 'expense',
    category_id: 'cat2',
    account_id: 'acc1',
    transaction_date: '2024-12-27',
    created_at: '2024-12-27T19:30:00Z',
    categories: { name: 'Alimentação', color: '#FF6B35', icon: 'utensils' },
    accounts: { name: 'Conta Corrente', type: 'checking' }
  },
  {
    id: '3',
    description: 'Salário',
    amount: 3500.00,
    type: 'income',
    category_id: 'cat3',
    account_id: 'acc1',
    transaction_date: '2024-12-25',
    created_at: '2024-12-25T08:00:00Z',
    categories: { name: 'Salário', color: '#1ABC9C', icon: 'dollar-sign' },
    accounts: { name: 'Conta Corrente', type: 'checking' }
  },
  {
    id: '4',
    description: 'Uber',
    amount: 25.50,
    type: 'expense',
    category_id: 'cat4',
    account_id: 'acc1',
    transaction_date: '2024-12-26',
    created_at: '2024-12-26T14:15:00Z',
    categories: { name: 'Transporte', color: '#9B59B6', icon: 'car' },
    accounts: { name: 'Conta Corrente', type: 'checking' }
  }
];

const mockCategories: Category[] = [
  { id: 'cat1', name: 'Supermercado', color: '#3498DB', icon: 'shopping-cart', amount: 150.00, percentage: 30 },
  { id: 'cat2', name: 'Alimentação', color: '#FF6B35', icon: 'utensils', amount: 80.00, percentage: 16 },
  { id: 'cat4', name: 'Transporte', color: '#9B59B6', icon: 'car', amount: 25.50, percentage: 5 },
  { id: 'cat5', name: 'Lazer', color: '#1ABC9C', icon: 'gamepad-2', amount: 120.00, percentage: 24 },
  { id: 'cat6', name: 'Saúde', color: '#F7DC6F', icon: 'heart', amount: 200.00, percentage: 25 }
];

export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  useEffect(() => {
    if (user) {
      // Simular carregamento de dados
      setTimeout(() => {
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        
        // Calcular gastos mensais
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTotal = mockTransactions
          .filter(t => {
            const transactionDate = new Date(t.transaction_date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear &&
                   t.type === 'expense';
          })
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
        
        setMonthlyExpenses(monthlyTotal);
        setLoading(false);
      }, 1000);
    } else {
      setTransactions([]);
      setCategories([]);
      setMonthlyExpenses(0);
      setLoading(false);
    }
  }, [user]);

  return {
    transactions,
    categories,
    monthlyExpenses,
    loading,
    refetch: () => {
      setLoading(true);
      setTimeout(() => {
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        setLoading(false);
      }, 500);
    }
  };
};
