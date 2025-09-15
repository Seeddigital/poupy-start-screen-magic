import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { otpService } from '@/services/otpService';

interface GuessExpenseInlineProps {
  onExpenseParsed: (expenseData: {
    amount: number;
    description: string;
    expenseable_type: string;
    expenseable_name: string;
    category_name: string;
    due_at: string;
  }) => void;
  onClose: () => void;
}

export function GuessExpenseInline({ onExpenseParsed, onClose }: GuessExpenseInlineProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() || !user || !session?.access_token || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await otpService.guessExpense(session.access_token, text.trim());
      
      if (response.success && response.expenses && response.expenses.length > 0) {
        onExpenseParsed(response.expenses[0]);
        setText('');
      } else {
        setError(response.error || 'Não foi possível processar a despesa. Tente ser mais específico.');
      }
    } catch (err) {
      console.error('Error guessing expense:', err);
      setError('Erro ao processar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-end justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <label htmlFor="guess-expense-input" className="sr-only">
              Digite sua despesa em linguagem natural
            </label>
            <div className="flex items-center space-x-3 bg-white rounded-xl p-3 shadow-lg border border-gray-200">
              <Input
                id="guess-expense-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex.: Mercado 120 no cartão Nubank (hoje)"
                className="flex-1 border-0 bg-transparent text-base py-2 px-2 focus:ring-0 focus-visible:ring-0 placeholder:text-gray-500"
                disabled={loading}
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                disabled={!text.trim() || loading}
                className="rounded-full bg-poupy-green hover:bg-poupy-green/90 text-poupy-green-foreground h-10 w-10 flex-shrink-0"
                aria-busy={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {error && (
            <div className="text-sm text-destructive bg-white rounded-lg px-3 py-2 shadow-sm border border-destructive/20" aria-live="polite">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}