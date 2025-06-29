
import React, { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular autenticação com telefone e senha
      // Em um cenário real, você faria uma chamada para sua API
      await authenticateWithPhone(phone, password);
      toast.success('Login realizado com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Telefone ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const authenticateWithPhone = async (phone: string, password: string) => {
    // Simular validação de credenciais
    // Você pode implementar sua lógica de autenticação aqui
    // Por exemplo, validar contra uma lista de usuários pré-definidos
    
    const validCredentials = [
      { phone: '11999999999', password: 'poupy123' },
      { phone: '11888888888', password: 'cliente456' },
      // Adicione mais credenciais conforme necessário
    ];

    const isValid = validCredentials.some(
      cred => cred.phone === phone && cred.password === password
    );

    if (!isValid) {
      throw new Error('Telefone ou senha incorretos');
    }

    // Se válido, criar uma sessão simulada
    // Em um cenário real, você criaria um token JWT ou similar
    localStorage.setItem('user_session', JSON.stringify({
      phone,
      authenticated: true,
      loginTime: new Date().toISOString()
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            Entrar no Poupy
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Telefone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-gray-800 text-white px-10 py-3 rounded-lg border border-gray-700 focus:border-[#A8E202] focus:outline-none"
                placeholder="11999999999"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 text-white px-10 py-3 rounded-lg border border-gray-700 focus:border-[#A8E202] focus:outline-none"
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

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Entre em contato para obter suas credenciais de acesso
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
