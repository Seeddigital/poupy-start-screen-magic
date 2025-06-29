
import React, { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhone(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Submitting login form...');
      const result = await signIn(phone, password);
      
      if (result.success) {
        console.log('Login successful, closing modal and navigating...');
        toast.success('Login realizado com sucesso!');
        onClose();
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result.error);
        toast.error(result.error || 'Erro ao fazer login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Entrar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de telefone
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                <img 
                  src="/lovable-uploads/2adb1bdd-a959-41a9-b76c-bbd95a3e644c.png" 
                  alt="Brasil" 
                  className="w-6 h-4 mr-2"
                />
                <span className="text-gray-600 text-sm">+55</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full bg-gray-50 text-gray-900 pl-20 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#A8E202] focus:outline-none"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 text-gray-900 pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#A8E202] focus:outline-none"
                placeholder="Sua senha"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A8E202] text-black py-3 rounded-lg font-medium hover:bg-[#96CC02] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Credenciais de teste:</p>
          <p>Telefone: (11) 99999-9999</p>
          <p>Senha: poupy123</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
