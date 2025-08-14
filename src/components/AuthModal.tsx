import React, { useState } from 'react';
import { X, Phone, Key, Check, AlertCircle, Smartphone } from 'lucide-react';
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
  const [countryCode, setCountryCode] = useState('+55');
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
    
    // Formato para API: código do país sem '+' + número do telefone
    const apiPhoneNumber = countryCode.replace('+', '') + phoneNumber;
    
    setLoading(true);
    try {
      const result = await sendOTP(apiPhoneNumber);
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
    
    // Formato para API: código do país sem '+' + número do telefone
    const apiPhoneNumber = countryCode.replace('+', '') + phoneNumber;
    
    setLoading(true);
    try {
      const result = await signInWithOTP(apiPhoneNumber, otpCode);
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

  // Phone number validation
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-[#151515] rounded-3xl p-8 w-full max-w-md mx-4 border border-gray-800 shadow-2xl">
        {/* Brand Element */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#A8E202] to-[#96CC02] rounded-2xl flex items-center justify-center shadow-lg">
            <Smartphone className="w-8 h-8 text-black" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">
              Entrar com Telefone
            </h2>
            <p className="text-gray-400 text-sm">
              Acesso rápido e seguro
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Phone Number Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-[#A8E202]" />
              <label className="text-base font-medium text-white">
                Número do Telefone
              </label>
            </div>
            
            <div className="flex gap-3">
              <div className="flex items-center bg-gray-900/50 rounded-xl border border-gray-700 focus-within:border-[#A8E202] focus-within:shadow-lg focus-within:shadow-[#A8E202]/20 transition-all">
                <select 
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-transparent text-white px-4 py-4 focus:outline-none rounded-xl"
                >
                  <option value="+55" className="bg-gray-900">🇧🇷 +55</option>
                  <option value="+1" className="bg-gray-900">🇺🇸 +1</option>
                  <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                  <option value="+33" className="bg-gray-900">🇫🇷 +33</option>
                  <option value="+49" className="bg-gray-900">🇩🇪 +49</option>
                </select>
              </div>
              
              <div className="flex items-center bg-gray-900/50 rounded-xl border border-gray-700 focus-within:border-[#A8E202] focus-within:shadow-lg focus-within:shadow-[#A8E202]/20 transition-all flex-1 relative">
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="flex-1 bg-transparent text-white px-4 py-4 focus:outline-none rounded-xl" 
                  placeholder="11 91234 5678" 
                  disabled={otpSent} 
                  required 
                />
                {phoneNumber && (
                  <div className="absolute right-3">
                    {isValidPhoneNumber(phoneNumber) ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading || otpSent || !isValidPhoneNumber(phoneNumber)} 
                className="bg-[#7A9B02] hover:bg-[#6B8502] text-white px-6 py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                <span className="text-xl">→</span>
              </button>
            </div>
            
            {/* Validation Message */}
            {phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                {isValidPhoneNumber(phoneNumber) ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-400">Número válido</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-400">Formato inválido</span>
                  </>
                )}
              </div>
            )}
            
            <p className="text-sm text-gray-300">
              Digite o DDD e número (ex: 11 91234 5678)
            </p>
          </div>

          {/* Verification Code Section */}
          {otpSent && (
            <div className="space-y-6 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-[#A8E202]" />
                <label className="text-base font-medium text-white">
                  Código de Verificação
                </label>
              </div>
              
              <div className="flex justify-center">
                <InputOTP 
                  maxLength={6} 
                  value={otpCode} 
                  onChange={(value) => setOtpCode(value)}
                  className="gap-3"
                >
                  <InputOTPGroup className="gap-3">
                    <InputOTPSlot 
                      index={0} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                    <InputOTPSlot 
                      index={1} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                    <InputOTPSlot 
                      index={2} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                    <InputOTPSlot 
                      index={3} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                    <InputOTPSlot 
                      index={4} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                    <InputOTPSlot 
                      index={5} 
                      className="w-12 h-12 text-lg font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 rounded-xl transition-all"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <p className="text-sm text-gray-300 text-center">
                Digite o código de 6 dígitos enviado por WhatsApp
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {otpSent && (
            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={loading || otpCode.length !== 6} 
                className="w-full bg-[#A8E202] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#96CC02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Verificar Código'
                )}
              </button>
              
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                  }} 
                  className="text-[#A8E202] hover:text-[#96CC02] transition-colors text-sm font-medium underline-offset-4 hover:underline"
                >
                  Alterar número
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
