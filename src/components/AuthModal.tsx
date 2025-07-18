import React, { useState } from 'react';
import { X, Phone, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const AuthModal = ({
  isOpen,
  onClose
}: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const {
    signIn,
    signUp,
    signInWithOTP,
    sendOTP
  } = useAuth();
  const navigate = useNavigate();
  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.error('Digite um número de telefone');
      return;
    }
    setLoading(true);
    try {
      const result = await sendOTP(phoneNumber);
      if (result.success) {
        setOtpSent(true);
        toast.success('Código enviado via WhatsApp!');
      } else {
        toast.error(result.error || 'Erro ao enviar código');
      }
    } catch (error) {
      toast.error('Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithOTP(phoneNumber, otpCode);
      if (result.success) {
        toast.success('Login realizado com sucesso!');
        onClose();
        navigate('/dashboard');
      } else {
        toast.error(result.error || 'Código inválido');
      }
    } catch (error) {
      toast.error('Erro ao verificar código');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOTP();
    } else {
      await handleVerifyOTP();
    }
  };
  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
    setOtpCode('');
    setOtpSent(false);
  };
  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-black rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            Entrar com Telefone
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>


        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Número do Telefone
            </label>
            <div className="flex gap-2">
              <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700 focus-within:border-[#A8E202]">
                <select className="bg-transparent text-white px-3 py-3 focus:outline-none">
                  <option value="+55" className="bg-gray-900">🇧🇷 +55</option>
                  <option value="+1" className="bg-gray-900">🇺🇸 +1</option>
                  <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                  <option value="+33" className="bg-gray-900">🇫🇷 +33</option>
                  <option value="+49" className="bg-gray-900">🇩🇪 +49</option>
                </select>
              </div>
              <div className="flex items-center bg-gray-900 rounded-lg border border-gray-700 focus-within:border-[#A8E202] flex-1">
                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="flex-1 bg-transparent text-white px-2 py-3 focus:outline-none" placeholder="11 91234 5678" disabled={otpSent} required />
              </div>
              <button type="submit" disabled={loading || otpSent} className="bg-[#A8E202] text-black px-4 py-3 rounded-lg font-medium hover:bg-[#96CC02] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                <span className="text-lg">→</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Digite o DDD e número (ex: 11 91234 5678)
            </p>
          </div>

          {otpSent && <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Código de Verificação
              </label>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpCode} onChange={value => setOtpCode(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Digite o código de 6 dígitos enviado por SMS
              </p>
            </div>}

          {!otpSent}

          {otpSent && <>
              <button type="submit" disabled={loading} className="w-full bg-[#A8E202] text-black py-3 rounded-lg font-medium hover:bg-[#96CC02] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Verificando...' : 'Verificar Código'}
              </button>
              
              <div className="text-center">
                <button type="button" onClick={() => {
              setOtpSent(false);
              setOtpCode('');
            }} className="text-[#A8E202] hover:text-[#96CC02] transition-colors text-sm">
                  Alterar número
                </button>
              </div>
            </>}
        </form>

      </div>
    </div>;
};
export default AuthModal;