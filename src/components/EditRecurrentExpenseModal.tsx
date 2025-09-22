import React, { useState, useEffect } from 'react';
import { X, Trash2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { otpService } from '@/services/otpService';
import { useAuth } from '@/hooks/useAuth';

interface EditRecurrentExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdated: () => void;
  onExpenseDeleted: () => void;
  expense: any;
}

const EditRecurrentExpenseModal = ({
  isOpen,
  onClose,
  onExpenseUpdated,
  onExpenseDeleted,
  expense
}: EditRecurrentExpenseModalProps) => {
  const { session } = useAuth();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [nextChargeDate, setNextChargeDate] = useState<Date>();
  const [startDate, setStartDate] = useState<Date>();
  const [categoryId, setCategoryId] = useState<number>();
  const [accountId, setAccountId] = useState<number>();
  const [accountType, setAccountType] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);

  useEffect(() => {
    if (expense && isOpen) {
      setDescription(expense.description || '');
      setAmount(Math.abs(expense.amount || 0).toString());
      setAccountType(expense.expenseable_type || '');
      setCategoryId(expense.expense_category_id);
      setAccountId(expense.expenseable_id);
      
      // Parse the start date
      if (expense.start_date) {
        const date = new Date(expense.start_date);
        if (!isNaN(date.getTime())) {
          setStartDate(date);
        }
      }
      
      // Parse the next charge date for display
      if (expense.next_charge_date) {
        const date = new Date(expense.next_charge_date);
        if (!isNaN(date.getTime())) {
          setNextChargeDate(date);
        }
      }
      
      fetchCategories();
      fetchAccounts();
    }
  }, [expense, isOpen]);

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
    
    if (!session?.access_token) {
      toast.error('Erro de autenticação');
      return;
    }

    if (!description.trim() || !amount || !startDate || !categoryId || !accountId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    
    try {
      // Format date for API (assuming ISO format)
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      
      // Map account type for API
      const selectedAccount = accounts.find(acc => acc.id === accountId);
      const expenseableType = selectedAccount?.type === 'credit_card' ? 'App\\Models\\CreditCard' : 'App\\Models\\Account';
      
      const updateData = {
        description: description.trim(),
        amount: parseFloat(amount),
        start_date: formattedDate,
        expense_category_id: categoryId,
        expenseable_type: expenseableType,
        expenseable_id: accountId
      };

      console.log('Updating recurrent expense:', { id: expense.id, data: updateData });
      
      const result = await otpService.updateRecurrentExpense(
        session.access_token,
        expense.id,
        updateData
      );

      if (result.success) {
        toast.success('Gasto fixo atualizado com sucesso!');
        onExpenseUpdated();
        onClose();
      } else {
        toast.error(result.error || 'Erro ao atualizar gasto fixo');
      }
    } catch (error) {
      console.error('Error updating recurrent expense:', error);
      toast.error('Erro ao atualizar gasto fixo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.access_token) {
      toast.error('Erro de autenticação');
      return;
    }

    setDeleting(true);
    
    try {
      console.log('Deleting recurrent expense:', expense.id);
      
      const result = await otpService.deleteRecurrentExpense(
        session.access_token,
        expense.id
      );

      if (result.success) {
        toast.success('Gasto fixo excluído com sucesso!');
        onExpenseDeleted();
        onClose();
      } else {
        toast.error(result.error || 'Erro ao excluir gasto fixo');
      }
    } catch (error) {
      console.error('Error deleting recurrent expense:', error);
      toast.error('Erro ao excluir gasto fixo');
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setStartDate(undefined);
    setNextChargeDate(undefined);
    setAccountType('');
    setCategoryId(undefined);
    setAccountId(undefined);
    setCategories([]);
    setAccounts([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-medium text-black flex-1 text-center">Editar Gasto Fixo</h2>
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
              onClick={handleClose}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
              placeholder="Ex: Internet"
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-white text-black rounded-md px-3 py-2"
              style={{ border: '1px solid #E0E0E0' }}
              placeholder="0,00"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Categoria
            </label>
            <select
              value={categoryId || ''}
              onChange={(e) => setCategoryId(Number(e.target.value))}
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
              value={accountId || ''}
              onChange={(e) => setAccountId(Number(e.target.value))}
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

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
              Data de Início
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white text-black rounded-md px-3 py-2",
                    !startDate && "text-gray-500"
                  )}
                  style={{ border: '1px solid #E0E0E0' }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {nextChargeDate && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#666666' }}>
                Próxima Cobrança
              </label>
              <div className="p-2 rounded-md text-sm" style={{ backgroundColor: '#F5F5F5', color: '#666666' }}>
                {nextChargeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 rounded-2xl bg-gray-100 text-black hover:bg-gray-200 font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-black text-white hover:bg-gray-800 font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRecurrentExpenseModal;