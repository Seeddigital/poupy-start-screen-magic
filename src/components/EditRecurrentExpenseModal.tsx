import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (expense && isOpen) {
      setDescription(expense.description || '');
      setAmount(expense.amount?.toString() || '');
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
    }
  }, [expense, isOpen]);

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

    setIsLoading(true);
    
    try {
      // Format date for API (assuming ISO format)
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      
      const updateData = {
        description: description.trim(),
        amount: parseFloat(amount),
        start_date: formattedDate,
        expense_category_id: categoryId,
        expenseable_type: accountType,
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
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!session?.access_token) {
      toast.error('Erro de autenticação');
      return;
    }

    setIsDeleting(true);
    
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
      setIsDeleting(false);
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Gasto Fixo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data de Início *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
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
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {nextChargeDate && (
            <div className="space-y-2">
              <Label>Próxima Cobrança</Label>
              <div className="p-2 bg-muted rounded-md text-sm text-muted-foreground">
                {nextChargeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="accountType">Tipo de Conta *</Label>
            <Select value={accountType} onValueChange={setAccountType} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de conta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conta_corrente">Conta Corrente</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="poupanca">Poupança</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting || isLoading}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </Button>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecurrentExpenseModal;