// Mock data for the application
export interface MockUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  created_at: string;
}

export interface MockCategory {
  category_id: number;
  name: string;
  color: string;
  icon?: string;
  user_id: string;
  created_at: string;
}

export interface MockAccount {
  id: number;
  name: string;
  type: string;
  balance: number;
  user_id: string;
  created_at: string;
}

export interface MockTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category_id: number;
  account_id: number;
  transaction_date: string;
  notes?: string;
  user_id: string;
  created_at: string;
}

export interface MockRecurrentExpense {
  id: number;
  description: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  start_date: string;
  end_date?: string;
  status: 'active' | 'paused';
  next_charge_date: string;
  expense_category_id: number;
  expenseable_type: string;
  expenseable_id: number;
  user_id: string;
  created_at: string;
}

// Default user for testing
export const DEFAULT_USER: MockUser = {
  id: 'user-123',
  email: 'teste@email.com',
  password: '123456',
  full_name: 'Usuário Teste',
  created_at: new Date().toISOString()
};

// Mock categories
export const MOCK_CATEGORIES: MockCategory[] = [
  {
    category_id: 1,
    name: 'Alimentação',
    color: '#FF6B6B',
    icon: '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    category_id: 2,
    name: 'Transporte',
    color: '#4ECDC4',
    icon: '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    category_id: 3,
    name: 'Lazer e Bem estar',
    color: '#45B7D1',
    icon: '/lovable-uploads/b86e683d-74fb-4388-bdbc-c21204e683ee.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    category_id: 4,
    name: 'Cuidados com saúde',
    color: '#96CEB4',
    icon: '/lovable-uploads/62fc26cb-a566-42b4-a3d8-126a6ec937c8.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    category_id: 5,
    name: 'Moradia',
    color: '#FFEAA7',
    icon: '/lovable-uploads/6ae08213-7de2-4e1e-8f10-fed260628827.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    category_id: 6,
    name: 'Mercado',
    color: '#DDA0DD',
    icon: '/lovable-uploads/a667bd8c-7cd8-48d8-a62f-7c9aa32c7ba0.png',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  }
];

// Mock accounts
export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: 1,
    name: 'Conta Corrente',
    type: 'corrente',
    balance: 2500.00,
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Cartão de Crédito',
    type: 'credito',
    balance: -850.00,
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: 'Poupança',
    type: 'poupanca',
    balance: 5000.00,
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  }
];

// Mock transactions for current month
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();

export const MOCK_TRANSACTIONS: MockTransaction[] = [
  {
    id: 'trans-1',
    description: 'Supermercado Extra',
    amount: -120.50,
    type: 'expense',
    category_id: 6,
    account_id: 1,
    transaction_date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0],
    notes: 'Compras da semana',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-2',
    description: 'Uber',
    amount: -25.00,
    type: 'expense',
    category_id: 2,
    account_id: 2,
    transaction_date: new Date(currentYear, currentMonth, 14).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-3',
    description: 'Cinema',
    amount: -45.00,
    type: 'expense',
    category_id: 3,
    account_id: 2,
    transaction_date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0],
    notes: 'Filme com amigos',
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-4',
    description: 'Restaurante',
    amount: -80.00,
    type: 'expense',
    category_id: 1,
    account_id: 1,
    transaction_date: new Date(currentYear, currentMonth, 10).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-5',
    description: 'Farmácia',
    amount: -35.50,
    type: 'expense',
    category_id: 4,
    account_id: 1,
    transaction_date: new Date(currentYear, currentMonth, 8).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-6',
    description: 'Aluguel',
    amount: -1200.00,
    type: 'expense',
    category_id: 5,
    account_id: 1,
    transaction_date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-7',
    description: 'Salário',
    amount: 3500.00,
    type: 'income',
    category_id: 1,
    account_id: 1,
    transaction_date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  },
  {
    id: 'trans-8',
    description: 'Gasolina',
    amount: -150.00,
    type: 'expense',
    category_id: 2,
    account_id: 2,
    transaction_date: new Date(currentYear, currentMonth, 20).toISOString().split('T')[0],
    user_id: DEFAULT_USER.id,
    created_at: new Date().toISOString()
  }
];