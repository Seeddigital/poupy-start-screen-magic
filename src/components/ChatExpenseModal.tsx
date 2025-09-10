import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { otpService } from '@/services/otpService';
import { toast } from 'sonner';

interface ChatExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseParsed: (expenseData: {
    amount: number;
    description: string;
    expenseable_type: string;
    expenseable_name: string;
    category_name: string;
    due_at: string;
  }) => void;
}

export default function ChatExpenseModal({ isOpen, onClose, onExpenseParsed }: ChatExpenseModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !session?.access_token || isLoading) return;

    setIsLoading(true);

    try {
      const response = await otpService.guessExpense(session.access_token, message);
      
      if (response.success && response.expenses && response.expenses.length > 0) {
        // Expense successfully parsed, close modal and pass data
        onExpenseParsed(response.expenses[0]);
        onClose();
        setMessage('');
      } else {
        toast.error(response.error || 'Não foi possível processar a despesa. Tente ser mais específico.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erro ao processar mensagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-[2rem] flex flex-col shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Nova Despesa</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white">
          <div className="flex items-center space-x-3">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua despesa em linguagem natural, ex: 'gastei 100 no mercado pelo Nubank'"
              className="flex-1 border-gray-200 focus:border-gray-300 text-base py-3 px-4 rounded-xl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={!message.trim() || isLoading}
              className="rounded-full bg-poupy-green hover:bg-poupy-green/90 text-poupy-green-foreground h-12 w-12"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center mt-4 text-gray-500 text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="ml-2">Processando...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}