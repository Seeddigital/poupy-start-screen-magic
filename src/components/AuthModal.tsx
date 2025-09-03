import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithOTP, sendOTP } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      toast.error('Digite um número de telefone');
      return;
    }

    const apiPhoneNumber = '55' + phoneNumber.replace(/\D/g, '');
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

    const apiPhoneNumber = '55' + phoneNumber.replace(/\D/g, '');
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
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-transparent p-0 pb-16">
      <div className="bg-white rounded-t-[2rem] w-full max-w-md p-6 pb-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!otpSent && (
            <>
              <div className="flex items-center bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                {/* Brazilian Flag */}
                <div className="flex items-center px-4 py-4">
                  <span className="text-xl">🇧🇷</span>
                </div>
                
                {/* Phone Input */}
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={e => setPhoneNumber(e.target.value)} 
                  className="flex-1 bg-transparent text-gray-800 px-2 py-4 focus:outline-none text-base placeholder:text-gray-500" 
                  placeholder="(11) 91234 5678" 
                  required 
                />
                
                {/* Green Arrow Button */}
                <button 
                  type="submit" 
                  disabled={loading || !isValidPhoneNumber(phoneNumber)} 
                  className="bg-[#A8E202] hover:bg-[#96CC02] text-black rounded-2xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg m-1 px-6 py-3"
                >
                  <span className="text-xl">→</span>
                </button>
              </div>
              
              {/* Error Message */}
              {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
                <div className="text-red-500 text-sm">
                  Número inválido
                </div>
              )}
            </>
          )}

          {/* Verification Code Section */}
          {otpSent && (
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <label className="font-semibold text-gray-800 text-lg">Código de Verificação</label>
              </div>
              
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otpCode} onChange={value => setOtpCode(value)} className="gap-2">
                  <InputOTPGroup className="gap-2">
                    {[0, 1, 2, 3, 4, 5].map(index => 
                      <InputOTPSlot 
                        key={index} 
                        index={index} 
                        className="w-12 h-12 font-bold border-gray-300 bg-gray-50 text-gray-800 focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 focus:ring-2 focus:ring-[#A8E202]/20 rounded-xl transition-all text-lg"
                      />
                    )}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <p className="text-gray-600 text-center text-sm">
                Digite o código de 6 dígitos enviado por WhatsApp
              </p>
              
              <button 
                type="submit" 
                disabled={loading || otpCode.length !== 6} 
                className="w-full bg-[#A8E202] text-black rounded-2xl font-semibold hover:bg-[#96CC02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl py-4 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
                  className="text-[#A8E202] hover:text-[#96CC02] transition-colors font-medium underline-offset-4 hover:underline text-sm"
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