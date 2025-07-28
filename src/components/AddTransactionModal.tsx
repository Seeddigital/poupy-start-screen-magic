
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
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

const AddTransactionModal = ({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer',
    category_id: '',
    account_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (isOpen && user) {
      fetchCategories();
      fetchAccounts();
    }
  }, [isOpen, user]);

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
        const userAccounts = [
          ...userResult.user.accounts.map((acc: any) => ({
            id: acc.id,
            name: acc.name,
            type: 'account'
          })),
          ...userResult.user.credit_cards.map((card: any) => ({
            id: card.id,
            name: card.name,
            type: 'credit_card'
          }))
        ];
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
        body: JSON.stringify({ description })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.id) {
          setFormData(prev => ({ ...prev, category_id: data.id.toString() }));
        }
      }
    } catch (error) {
      console.error('Error suggesting category:', error);
    } finally {
      setSuggestingCategory(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const description = e.target.value;
    setFormData({ ...formData, description });
    
    // Suggest category after user stops typing (debounce)
    const timeoutId = setTimeout(() => {
      if (description.length > 3) { // Only suggest if description has more than 3 characters
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
          notes: ''
        });
      } else {
        toast.error(result.error || 'Erro ao criar transação');
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao criar transação');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Nova Transação</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={handleDescriptionChange}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Valor (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              placeholder="0,00"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' | 'transfer' })}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
              required
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="transfer">Transferência</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Categoria {suggestingCategory && <span className="text-sm text-gray-500">(sugerindo...)</span>}
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Conta
            </label>
            <select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2"
              required
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Data
            </label>
            <Input
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="bg-gray-900 border-gray-700 text-white"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-md px-3 py-2 resize-none"
              rows={3}
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A8E202] hover:bg-[#96D000] text-black font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar Transação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
