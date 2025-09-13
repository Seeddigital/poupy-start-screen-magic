import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  preFilledData?: {
    amount: number;
    description: string;
    expenseable_type: string;
    expenseable_name: string;
    category_name: string;
    due_at: string;
  };
}
interface Category {
  id: number;
  name: string;
  color?: string;
  icon?: string;
}
interface Account {
  id: number;
  name: string;
  brand?: string;
  type: string;
}
const AddTransactionModal = ({
  isOpen,
  onClose,
  onTransactionAdded,
  preFilledData
}: AddTransactionModalProps) => {
  const {
    user,
    session
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer' | 'recurrent',
    category_id: '',
    account_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: '',
    // Recurrent expense fields (only monthly)
    start_date: new Date().toISOString().split('T')[0]
  });
  useEffect(() => {
    if (isOpen && user) {
      fetchCategories();
      fetchAccounts();
    }
  }, [isOpen, user]);

  // Pre-fill form when preFilledData is provided
  useEffect(() => {
    if (preFilledData && categories.length > 0 && accounts.length > 0) {
      setFormData(prev => ({
        ...prev,
        description: preFilledData.description || '',
        amount: Math.abs(preFilledData.amount).toString() || '',
        type: preFilledData.amount < 0 ? 'expense' : 'income',
        category_id: categories.find(cat => 
          cat.name.toLowerCase() === preFilledData.category_name?.toLowerCase()
        )?.id.toString() || '',
        account_id: accounts.find(acc => 
          acc.name.toLowerCase() === preFilledData.expenseable_name?.toLowerCase()
        )?.id.toString() || '',
        transaction_date: (() => {
          const apiDate = preFilledData.due_at;
          if (apiDate) {
            const parsedDate = new Date(apiDate);
            // Se a data da API é muito antiga (mais de 1 ano), usar data atual
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            
            if (parsedDate < oneYearAgo) {
              return new Date().toISOString().split('T')[0];
            }
            return parsedDate.toISOString().split('T')[0];
          }
          return new Date().toISOString().split('T')[0];
        })()
      }));
    }
  }, [preFilledData, categories, accounts]);
  const fetchCategories = async () => {
    try {
      if (!session?.access_token) return;
      const result = await otpService.getCategories(session.access_token);
      if (result.success && result.categories) {
        setCategories(result.categories.filter((cat: any) => cat.name)); // Filter out empty names
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchAccounts = async () => {
    try {
      if (!session?.access_token) return;
      const userResult = await otpService.getUserInfo(session.access_token);
      if (userResult.success && userResult.user) {
        const userAccounts = [...userResult.user.accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name,
          type: 'account'
        })), ...userResult.user.credit_cards.map((card: any) => ({
          id: card.id,
          name: card.name,
          type: 'credit_card'
        }))];
        setAccounts(userAccounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };
  const suggestCategory = async (description: string) => {
    if (!description.trim() || !session?.access_token) return;
    setSuggestingCategory(true);
    try {
      const response = await fetch('https://api.poupy.ai/api/categories/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          description
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setFormData(prev => ({
            ...prev,
            category_id: data.id.toString()
          }));
        }
      }
    } catch (error) {
      console.error('Error suggesting category:', error);
    } finally {
      setSuggestingCategory(false);
    }
  };
  const formatCurrency = (value: string) => {
    // Convert the string value to cents for formatting
    const numericValue = parseFloat(value) || 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numericValue);
  };
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Remove all non-digit characters
    const digitsOnly = inputValue.replace(/[^\d]/g, '');
    if (digitsOnly === '') {
      setFormData({
        ...formData,
        amount: '0'
      });
      return;
    }

    // Convert cents to reais (divide by 100)
    const numericAmount = parseInt(digitsOnly) / 100;
    setFormData({
      ...formData,
      amount: numericAmount.toString()
    });
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFormData({
      ...formData,
      description
    });

    // Suggest category after user stops typing (debounce)
    const timeoutId = setTimeout(() => {
      if (description.length > 3) {
        // Only suggest if description has more than 3 characters
        suggestCategory(description);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !session?.access_token) return;
    setLoading(true);
    try {
      if (formData.type === 'recurrent') {
        // Create recurrent expense
        const recurrentData: {
          description: string;
          amount: number;
          start_date: string;
          expense_category_id: number;
          expenseable_type: string;
          expenseable_id: number;
        } = {
          description: formData.description,
          amount: parseFloat(formData.amount),
          start_date: formData.start_date,
          expense_category_id: parseInt(formData.category_id),
          expenseable_type: 'App\\Models\\Account',
          expenseable_id: parseInt(formData.account_id)
        };

        const result = await otpService.createRecurrentExpense(session.access_token, recurrentData);
        
        if (result.success) {
          toast.success('Despesa recorrente criada com sucesso!');
        } else {
          toast.error(result.error || 'Erro ao criar despesa recorrente');
          return;
        }
      } else {
        // Create regular transaction
        const selectedAccount = accounts.find(acc => acc.id === parseInt(formData.account_id));
        const amount = parseFloat(formData.amount);
        const transactionData = {
          description: formData.description,
          amount: formData.type === 'income' ? Math.abs(amount) : -Math.abs(amount),
          due_at: formData.transaction_date,
          expense_category_id: parseInt(formData.category_id),
          expenseable_type: selectedAccount?.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
          expenseable_id: parseInt(formData.account_id)
        };
        console.log('Sending transaction data:', transactionData);
        console.log('Transaction type:', formData.type);
        const result = await otpService.createExpense(session.access_token, transactionData);
        if (result.success) {
          const messageType = formData.type === 'income' ? 'receita' : 'despesa';
          toast.success(`${messageType.charAt(0).toUpperCase() + messageType.slice(1)} criada com sucesso!`);
        } else {
          toast.error(result.error || 'Erro ao criar transação');
          return;
        }
      }

      onTransactionAdded();
      onClose();

      // Reset form
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category_id: '',
        account_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: '',
        start_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2 mx-[20px] px-[24px] py-[18px] my-[8px]">
          <img src="/lovable-uploads/ffd2aa23-a813-4b2b-8e8b-4bc791036c8c.png" alt="Poupy Logo" className="h-6 w-auto" />
          
          <h2 className="text-lg font-bold text-black flex-1 text-center">
            Nova Transação
          </h2>
          
          <button onClick={onClose} className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={14} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 space-y-3">
          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-[#666666] text-xs font-medium mb-1 block">
              Descrição
            </Label>
            <Input id="description" type="text" value={formData.description} onChange={handleDescriptionChange} className="py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1" placeholder="Ex: Supermercado" required />
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount" className="text-[#666666] text-xs font-medium mb-1 block">
              Valor
            </Label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#666666]" />
              <Input id="amount" value={formatCurrency(formData.amount)} onChange={handleAmountChange} placeholder="R$ 0,00" className="pl-7 py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1" required />
            </div>
          </div>

          {/* Type */}
          <div>
            <Label htmlFor="type" className="text-[#666666] text-xs font-medium mb-1 block">
              Tipo
            </Label>
            <select id="type" value={formData.type} onChange={e => setFormData({
            ...formData,
            type: e.target.value as 'income' | 'expense' | 'transfer' | 'recurrent'
          })} className="w-full py-2 text-sm bg-white border border-[#E0E0E0] text-black rounded-md px-3 focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1 focus:outline-none" required>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="transfer">Transferência</option>
              <option value="recurrent">Despesas Recorrentes</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-[#666666] text-xs font-medium mb-1 block">
              Categoria {suggestingCategory && <span className="text-xs text-[#999999]">(sugerindo...)</span>}
            </Label>
            <select id="category" value={formData.category_id} onChange={e => setFormData({
            ...formData,
            category_id: e.target.value
          })} className="w-full py-2 text-sm bg-white border border-[#E0E0E0] text-black rounded-md px-3 focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1 focus:outline-none" required>
              <option value="" className="text-[#999999]">Selecione uma categoria</option>
              {categories.map(category => <option key={category.id} value={category.id}>
                  {category.name}
                </option>)}
            </select>
          </div>

          {/* Account */}
          <div>
            <Label htmlFor="account" className="text-[#666666] text-xs font-medium mb-1 block">
              Conta
            </Label>
            <select id="account" value={formData.account_id} onChange={e => setFormData({
            ...formData,
            account_id: e.target.value
          })} className="w-full py-2 text-sm bg-white border border-[#E0E0E0] text-black rounded-md px-3 focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1 focus:outline-none" required>
              <option value="" className="text-[#999999]">Selecione uma conta</option>
              {accounts.map(account => <option key={account.id} value={account.id}>
                  {account.name}
                </option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="date" className="text-[#666666] text-xs font-medium mb-1 block">
              Data
            </Label>
            <Input id="date" type="date" value={formData.transaction_date} onChange={e => setFormData({
            ...formData,
            transaction_date: e.target.value
          })} className="py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1" required />
          </div>

          {/* Recurrent Fields - Only show when type is 'recurrent' */}
          {formData.type === 'recurrent' && (
            <>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-[#666666] mb-2">
                  <strong>Frequência:</strong> Mensal (automático)
                </p>
                <p className="text-xs text-[#666666]">
                  Esta despesa será registrada automaticamente todo mês.
                </p>
              </div>

              <div>
                <Label htmlFor="start_date" className="text-[#666666] text-xs font-medium mb-1 block">
                  Data de início
                </Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  value={formData.start_date} 
                  onChange={e => setFormData({
                    ...formData,
                    start_date: e.target.value
                  })} 
                  className="py-2 text-sm bg-white border-[#E0E0E0] text-black focus:border-[#A6FF00] focus:ring-[#A6FF00] focus:ring-1" 
                  required 
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-3">
            <Button type="submit" disabled={loading || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) < 0} className="px-3 py-1.5 bg-[#A6FF00] text-black rounded-lg text-xs hover:bg-[#95E600] transition-colors">
              {loading ? 'Salvando...' : 'Salvar Transação'}
            </Button>
          </div>
        </form>
      </div>
    </div>;
};
export default AddTransactionModal;