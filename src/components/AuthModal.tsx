import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

// Fixed Router context issue

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithOTP, sendOTP } = useAuth();

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
        onSuccess?.();
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
      <div className="bg-white rounded-[2rem] w-full max-w-md p-6 pb-8 shadow-2xl">
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
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <p className="text-gray-800 text-base font-medium">Código enviado para o seu Whatsapp</p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex gap-3">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={otpCode[index] || ''}
                      onChange={(e) => {
                        const newOtp = otpCode.split('');
                        newOtp[index] = e.target.value;
                        setOtpCode(newOtp.join(''));
                        
                        // Auto focus next input
                        if (e.target.value && index < 5) {
                          const target = e.target as HTMLInputElement;
                          const nextInput = target.parentElement?.children[index + 1] as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Handle backspace
                        if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                          const target = e.target as HTMLInputElement;
                          const prevInput = target.parentElement?.children[index - 1] as HTMLInputElement;
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-16 text-center text-4xl font-bold text-gray-400 bg-gray-100 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-[#A8E202] focus:bg-white transition-all"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setOtpSent(false);
                    setOtpCode('');
                  }} 
                  className="flex-1 bg-gray-200 text-gray-700 rounded-2xl font-medium py-4 text-base hover:bg-gray-300 transition-all"
                >
                  Alterar número
                </button>
                
                <button 
                  type="submit" 
                  disabled={loading || otpCode.length !== 6} 
                  className="flex-1 bg-[#A8E202] text-black rounded-2xl font-medium hover:bg-[#96CC02] transition-all disabled:opacity-50 disabled:cursor-not-allowed py-4 text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Verificando...</span>
                    </div>
                  ) : (
                    'Verificar código'
                  )}
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