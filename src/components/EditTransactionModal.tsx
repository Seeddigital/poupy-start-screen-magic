import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionUpdated: () => void;
  transactionId: number;
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

interface TransactionData {
  id: number;
  description: string;
  amount: number;
  due_at: string;
  expense_category_id: number;
  expenseable_id: number;
  expenseable_type: string;
  category?: Category;
  expenseable?: Account;
}

const EditTransactionModal = ({ isOpen, onClose, onTransactionUpdated, transactionId }: EditTransactionModalProps) => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer',
    category_id: '',
    account_id: '',
    transaction_date: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && user && transactionId) {
      fetchTransactionData();
      fetchCategories();
      fetchAccounts();
    }
  }, [isOpen, user, transactionId]);

  const fetchTransactionData = async () => {
    try {
      if (!session?.access_token) return;
      
      const result = await otpService.getExpense(session.access_token, transactionId);
      
      if (result.success && result.expense) {
        const expense = result.expense;
        setTransaction(expense);
        
        // Populate form data
        const transactionDate = expense.due_at ? expense.due_at.split('T')[0] : new Date().toISOString().split('T')[0];
        setFormData({
          description: expense.description || '',
          amount: Math.abs(Number(expense.amount)).toString(),
          type: Number(expense.amount) > 0 ? 'income' : 'expense',
          category_id: expense.expense_category_id?.toString() || '',
          account_id: expense.expenseable_id?.toString() || '',
          transaction_date: transactionDate,
          notes: ''
        });
      }
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('Erro ao carregar dados da transação');
    }
  };

  const fetchCategories = async () => {
    try {
      if (!session?.access_token) return;
      
      const result = await otpService.getCategories(session.access_token);
      
      if (result.success && result.categories) {
        setCategories(result.categories.filter((cat: any) => cat.name));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !session?.access_token || !transaction) return;
    
    // Validações antes de enviar
    if (!formData.account_id) {
      toast.error('Selecione uma conta válida');
      return;
    }
    
    if (!formData.category_id) {
      toast.error('Selecione uma categoria válida');
      return;
    }
    
    const selectedAccount = accounts.find(acc => acc.id === parseInt(formData.account_id));
    
    if (!selectedAccount) {
      toast.error(`Conta não encontrada. ID: ${formData.account_id}`);
      return;
    }
    
    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      
      const transactionData = {
        description: formData.description,
        amount: formData.type === 'income' ? Math.abs(amount) : -Math.abs(amount),
        due_at: formData.transaction_date + 'T00:00:00.000000Z',
        expense_category_id: parseInt(formData.category_id),
        expenseable_type: selectedAccount.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
        expenseable_id: parseInt(formData.account_id)
      };

      const result = await otpService.updateExpense(session.access_token, transactionId, transactionData);

      if (result.success) {
        const messageType = formData.type === 'income' ? 'receita' : 'despesa';
        toast.success(`${messageType.charAt(0).toUpperCase() + messageType.slice(1)} atualizada com sucesso!`);
        onTransactionUpdated();
        onClose();
      } else {
        toast.error(result.error || 'Erro ao atualizar transação');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Erro ao atualizar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.access_token || !transaction) return;
    
    if (!confirm('Tem certeza que deseja deletar esta transação?')) return;
    
    setDeleting(true);
    
    try {
      const result = await otpService.deleteExpense(session.access_token, transactionId);

      if (result.success) {
        toast.success('Transação deletada com sucesso!');
        onTransactionUpdated();
        onClose();
      } else {
        toast.error(result.error || 'Erro ao deletar transação');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Erro ao deletar transação');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Editar Transação</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Trash2 size={16} className="text-white" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
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
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              Categoria
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

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#A8E202] hover:bg-[#96D000] text-black font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;