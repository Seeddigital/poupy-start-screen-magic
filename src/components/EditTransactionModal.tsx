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
  isRecurrent?: boolean;
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

const EditTransactionModal = ({ isOpen, onClose, onTransactionUpdated, transactionId, isRecurrent = false }: EditTransactionModalProps) => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer' | 'recurrent',
    category_id: '',
    account_id: '',
    transaction_date: '',
    notes: '',
    // Recurrent expense fields (only monthly)
    start_date: new Date().toISOString().split('T')[0]
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
      
      console.log(`Fetching ${isRecurrent ? 'recurrent' : 'regular'} transaction with ID:`, transactionId);
      
      let expense;
      
      if (isRecurrent) {
        const result = await otpService.getRecurrentExpense(session.access_token, transactionId);
        if (result.success && result.recurrentExpense) {
          expense = result.recurrentExpense;
        } else {
          toast.error('Despesa recorrente não encontrada');
          return;
        }
      } else {
        const result = await otpService.getExpense(session.access_token, transactionId);
        if (result.success && result.expense) {
          expense = result.expense;
        } else {
          toast.error('Transação não encontrada');
          return;
        }
      }
      
      setTransaction(expense);
      
      // Populate form data with proper date field mapping
      const transactionDate = isRecurrent 
        ? (expense.start_date ? expense.start_date.split('T')[0] : new Date().toISOString().split('T')[0])
        : (expense.due_at ? expense.due_at.split('T')[0] : new Date().toISOString().split('T')[0]);
        
      setFormData({
        description: expense.description || '',
        amount: Math.abs(Number(expense.amount)).toString(),
        type: isRecurrent ? 'recurrent' : (Number(expense.amount) > 0 ? 'income' : 'expense'),
        category_id: expense.expense_category_id?.toString() || '',
        account_id: expense.expenseable_id?.toString() || '',
        transaction_date: transactionDate,
        notes: '',
        start_date: transactionDate
      });
    } catch (error) {
      console.error(`Error fetching ${isRecurrent ? 'recurrent' : 'regular'} transaction:`, error);
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

    // Check if user is changing the transaction type
    const originalType = isRecurrent ? 'recurrent' : (Number(transaction.amount) > 0 ? 'income' : 'expense');
    const isTypeChanging = formData.type !== originalType;
    
    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      
      console.log(`=== DEBUGGING TRANSACTION UPDATE ===`);
      console.log('Transaction ID:', transactionId);
      console.log('Original Is Recurrent:', isRecurrent);
      console.log('New Type:', formData.type);
      console.log('Is Type Changing:', isTypeChanging);
      console.log('Form Data:', formData);
      console.log('Selected Account:', selectedAccount);

      let result;
      
      if (isTypeChanging) {
        // Handle type conversion using Promise.all for better synchronization
        if (formData.type === 'recurrent') {
          // Converting to recurrent
          const recurrentTransactionData = {
            description: formData.description,
            amount: -Math.abs(amount), // Recurrent expenses are always negative
            start_date: formData.start_date || formData.transaction_date,
            expense_category_id: parseInt(formData.category_id),
            expenseable_type: selectedAccount.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
            expenseable_id: parseInt(formData.account_id)
          };
          
          // Use Promise.all to ensure both operations complete
          const [createResult, deleteResult] = await Promise.all([
            otpService.createRecurrentExpense(session.access_token, recurrentTransactionData),
            otpService.deleteExpense(session.access_token, transactionId)
          ]);
          
          if (!createResult.success) {
            throw new Error(createResult.error || 'Falha ao criar despesa recorrente');
          }
          
          if (!deleteResult.success) {
            throw new Error(deleteResult.error || 'Falha ao deletar despesa original');
          }
          
          result = createResult;
        } else {
          // Converting from recurrent to regular
          const regularTransactionData = {
            description: formData.description,
            amount: formData.type === 'income' ? Math.abs(amount) : -Math.abs(amount),
            due_at: formData.transaction_date,
            expense_category_id: parseInt(formData.category_id),
            expenseable_type: selectedAccount.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
            expenseable_id: parseInt(formData.account_id)
          };
          
          // Use Promise.all to ensure both operations complete
          const [createResult, deleteResult] = await Promise.all([
            otpService.createExpense(session.access_token, regularTransactionData),
            otpService.deleteRecurrentExpense(session.access_token, transactionId)
          ]);
          
          if (!createResult.success) {
            throw new Error(createResult.error || 'Falha ao criar despesa regular');
          }
          
          if (!deleteResult.success) {
            throw new Error(deleteResult.error || 'Falha ao deletar despesa recorrente original');
          }
          
          result = createResult;
        }
        
        // Show specific toast for conversions
        const conversionType = formData.type === 'recurrent' ? 'recorrente' : 'regular';
        toast.success(`Despesa convertida para ${conversionType} com sucesso!`);
        
        // Add delay to ensure API synchronization before refetch
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Force complete refresh by clearing cache
        onTransactionUpdated();
        onClose();
        
      } else {
        // Regular update without type change
        if (isRecurrent) {
          const recurrentTransactionData = {
            description: formData.description,
            amount: -Math.abs(amount), // Recurrent expenses are always negative
            start_date: formData.transaction_date,
            expense_category_id: parseInt(formData.category_id),
            expenseable_type: selectedAccount.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
            expenseable_id: parseInt(formData.account_id)
          };
          console.log('Final Recurrent Transaction Data being sent:', recurrentTransactionData);
          result = await otpService.updateRecurrentExpense(session.access_token, transactionId, recurrentTransactionData);
        } else {
          const regularTransactionData = {
            description: formData.description,
            amount: formData.type === 'income' ? Math.abs(amount) : -Math.abs(amount),
            due_at: formData.transaction_date,
            expense_category_id: parseInt(formData.category_id),
            expenseable_type: selectedAccount.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account',
            expenseable_id: parseInt(formData.account_id)
          };
          console.log('Final Regular Transaction Data being sent:', regularTransactionData);
          result = await otpService.updateExpense(session.access_token, transactionId, regularTransactionData);
        }

        if (result.success) {
          const messageType = formData.type === 'income' ? 'receita' : 
                             formData.type === 'recurrent' ? 'despesa recorrente' : 'despesa';
          toast.success(`${messageType.charAt(0).toUpperCase() + messageType.slice(1)} atualizada com sucesso!`);
          onTransactionUpdated();
          onClose();
        } else {
          toast.error(result.error || 'Erro ao processar transação');
        }
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar transação');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.access_token || !transaction) return;
    
    const transactionType = isRecurrent ? 'despesa recorrente' : 'transação';
    
    setDeleting(true);
    
    try {
      console.log(`Deleting ${transactionType} with ID:`, transactionId, 'isRecurrent:', isRecurrent);
      
      let result;
      if (isRecurrent) {
        result = await otpService.deleteRecurrentExpense(session.access_token, transactionId);
      } else {
        result = await otpService.deleteExpense(session.access_token, transactionId);
      }

      if (result.success) {
        console.log(`${transactionType} deleted successfully`);
        toast.success(`${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)} deletada com sucesso!`);
        onTransactionUpdated();
        onClose();
      } else {
        console.error(`Error deleting ${transactionType}:`, result.error);
        toast.error(result.error || `Erro ao deletar ${transactionType}`);
      }
    } catch (error) {
      console.error(`Error deleting ${transactionType}:`, error);
      toast.error(`Erro ao deletar ${transactionType}`);
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-medium text-black flex-1 text-center">Editar Transação</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#EAEAEA' }}
            >
              <Trash2 size={16} className="text-black" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: '#EAEAEA' }}
            >
              <X size={16} className="text-black" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Descrição
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Valor (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
              placeholder="0,00"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' | 'transfer' | 'recurrent' })}
              className="w-full bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
              required
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="transfer">Transferência</option>
              <option value="recurrent">Despesas Recorrentes</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Categoria
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
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
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Conta
            </label>
            <select
              value={formData.account_id}
              onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
              className="w-full bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
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
             <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
               {formData.type === 'recurrent' ? 'Data da transação' : 'Data'}
             </label>
             <Input
               type="date"
               value={formData.transaction_date}
               onChange={(e) => setFormData({ 
                 ...formData, 
                 transaction_date: e.target.value,
                 // Update start_date for recurrent expenses
                 start_date: formData.type === 'recurrent' ? e.target.value : formData.start_date
               })}
               className="bg-white text-black rounded-md px-3 py-2"
               style={{ border: '1px solid #E0E0E0' }}
               required
             />
           </div>

          {/* Recurrent Fields - Only show when type is 'recurrent' */}
          {formData.type === 'recurrent' && (
            <>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Frequência:</strong> Mensal (automático)
                </p>
                <p className="text-xs text-gray-600">
                  Esta despesa será registrada automaticamente todo mês.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                  Data de início
                </label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="bg-white text-black rounded-md px-3 py-2"
                  style={{ border: '1px solid #E0E0E0' }}
                  required
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-3 rounded-2xl text-black font-medium disabled:opacity-50"
              style={{ backgroundColor: '#EAEAEA' }}
            >
              {deleting ? 'Excluindo...' : 'Excluir registro'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-2xl text-black font-medium disabled:opacity-50"
              style={{ backgroundColor: '#A6FF00' }}
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;