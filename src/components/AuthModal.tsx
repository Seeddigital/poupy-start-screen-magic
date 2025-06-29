
import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const formatPhoneNumber = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 91234 5678
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2 $3').replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2 $3');
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Extrair apenas os números do telefone
      const cleanPhone = phone.replace(/\D/g, '');
      await signIn(cleanPhone, password);
      toast.success('Login realizado com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Telefone ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Entrar no Poupy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de Telefone com Bandeira do Brasil */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <img 
                  src="/lovable-uploads/2adb1bdd-a959-41a9-b76c-bbd95a3e644c.png" 
                  alt="Brasil" 
                  className="w-6 h-6 rounded"
                />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full bg-gray-100 text-gray-900 pl-16 pr-4 py-4 rounded-xl border-0 focus:bg-gray-200 focus:outline-none text-lg"
                placeholder="(11) 91234 5678"
                maxLength={15}
                required
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 text-gray-900 px-4 py-4 rounded-xl border-0 focus:bg-gray-200 focus:outline-none text-lg"
              placeholder="Senha"
              required
            />
          </div>

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A8E202] text-black py-4 rounded-xl font-medium hover:bg-[#96CC02] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              'Entrando...'
            ) : (
              <ArrowRight size={24} />
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Entre em contato para obter suas credenciais de acesso
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
