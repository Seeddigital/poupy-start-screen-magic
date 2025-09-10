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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatExpenseModal({ isOpen, onClose, onExpenseParsed }: ChatExpenseModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Descreva sua despesa em linguagem natural, por exemplo: "gastei 100 no mercado pelo Nubank"',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, session } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !session?.access_token || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await otpService.guessExpense(session.access_token, message);
      
      if (response.success) {
        if (response.expenses && response.expenses.length > 0) {
          // Expense successfully parsed, close modal and pass data
          onExpenseParsed(response.expenses[0]);
          onClose();
          return;
        }
        
        if (response.message) {
          // API needs more information, continue conversation
          const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: response.message,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        }
      } else {
        toast.error(response.error || 'Erro ao processar mensagem');
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
      <div className="bg-white w-full max-w-md h-[70vh] rounded-t-[2rem] flex flex-col shadow-2xl border border-gray-100">
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

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.isUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua despesa..."
              className="flex-1 border-gray-200 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={!message.trim() || isLoading}
              className="rounded-full bg-blue-500 hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}