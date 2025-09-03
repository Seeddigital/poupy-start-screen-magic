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
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4 safe-area-inset">
      <div className="bg-[#151515] rounded-3xl w-full border border-gray-800 shadow-2xl overflow-y-auto max-h-[min(88vh,720px)]
                      max-w-[320px] xs:max-w-[360px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-[560px]
                      p-4 xs:p-5 sm:p-6 lg:p-8">
        {/* Brand Element */}
        <div className="flex justify-center mb-4 sm:mb-6 mx-px my-0 px-0 py-0">
          <img src="/lovable-uploads/ffd2aa23-a813-4b2b-8e8b-4bc791036c8c.png" alt="Poupy Logo" className="h-12 sm:h-16 w-auto object-contain" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 sm:mb-8 lg:mb-10 gap-3">
          <div className="flex-1 min-w-0">
            
            
          </div>
          
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
          {/* Phone Number Section - Only show when OTP not sent */}
          {!otpSent && <div className="flex flex-col gap-4 sm:gap-6">
              {/* Integrated Phone Input Bar */}
              <div className="w-full">
                {/* Mobile: Stacked layout */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {/* Country selector - mobile */}
                  <div className="flex items-center bg-gray-900/50 rounded-2xl border border-gray-700/50 focus-within:border-[#A8E202]/60 focus-within:shadow-lg focus-within:shadow-[#A8E202]/10 focus-within:bg-gray-800/60 transition-all duration-300">
                    <select 
                      value={countryCode} 
                      onChange={e => setCountryCode(e.target.value)} 
                      className="bg-transparent text-white px-4 py-4 focus:outline-none rounded-2xl w-full text-base"
                    >
                      <option value="+55" className="bg-gray-900">🇧🇷 +55</option>
                      <option value="+1" className="bg-gray-900">🇺🇸 +1</option>
                      <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                      <option value="+33" className="bg-gray-900">🇫🇷 +33</option>
                      <option value="+49" className="bg-gray-900">🇩🇪 +49</option>
                    </select>
                  </div>
                  
                  {/* Phone input with integrated button - mobile */}
                  <div className="flex items-center bg-gray-900/50 rounded-2xl border border-gray-700/50 focus-within:border-[#A8E202]/60 focus-within:shadow-lg focus-within:shadow-[#A8E202]/10 focus-within:bg-gray-800/60 transition-all duration-300 overflow-hidden">
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)} 
                      className="flex-1 bg-transparent text-white px-4 py-4 focus:outline-none text-base placeholder:text-gray-500" 
                      placeholder="11 91234 5678" 
                      required 
                    />
                    <button 
                      type="submit" 
                      disabled={loading || !isValidPhoneNumber(phoneNumber)} 
                      className="bg-[#A8E202] hover:bg-[#96CC02] text-black rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg m-2 px-4 py-3 transform hover:scale-105 active:scale-95"
                    >
                      <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
                
                {/* Desktop: Single row layout */}
                <div className="hidden sm:flex items-center bg-gray-900/50 rounded-2xl border border-gray-700/50 focus-within:border-[#A8E202]/60 focus-within:shadow-lg focus-within:shadow-[#A8E202]/10 focus-within:bg-gray-800/60 transition-all duration-300 overflow-hidden">
                  {/* Country selector */}
                  <div className="flex items-center border-r border-gray-700/50">
                    <select 
                      value={countryCode} 
                      onChange={e => setCountryCode(e.target.value)} 
                      className="bg-transparent text-white px-4 py-4 focus:outline-none text-base min-w-[100px]"
                    >
                      <option value="+55" className="bg-gray-900">🇧🇷 +55</option>
                      <option value="+1" className="bg-gray-900">🇺🇸 +1</option>
                      <option value="+44" className="bg-gray-900">🇬🇧 +44</option>
                      <option value="+33" className="bg-gray-900">🇫🇷 +33</option>
                      <option value="+49" className="bg-gray-900">🇩🇪 +49</option>
                    </select>
                  </div>
                  
                  {/* Phone input */}
                  <input 
                    type="tel" 
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                    className="flex-1 bg-transparent text-white px-4 py-4 focus:outline-none text-base placeholder:text-gray-500" 
                    placeholder="11 91234 5678" 
                    required 
                  />
                  
                  {/* Integrated submit button */}
                  <button 
                    type="submit" 
                    disabled={loading || !isValidPhoneNumber(phoneNumber)} 
                    className="bg-[#A8E202] hover:bg-[#96CC02] text-black rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg m-2 px-5 py-3 transform hover:scale-105 active:scale-95"
                  >
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            </div>}

          {/* Verification Code Section */}
          {otpSent && <>
              {/* Subtle Divider */}
              <div className="border-t border-gray-800 mx-4 sm:mx-6 lg:mx-8"></div>
              
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 sm:w-5 sm:h-5 text-[#A8E202] flex-shrink-0" />
                  <label className="font-semibold text-white" style={{
                fontSize: 'clamp(14px, 2.4vw, 16px)'
              }}> Código de Verificação</label>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otpCode} onChange={value => setOtpCode(value)} className="gap-2 sm:gap-3">
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      {[0, 1, 2, 3, 4, 5].map(index => <InputOTPSlot key={index} index={index} className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 font-bold border-gray-700 bg-gray-900/50 text-white focus:border-[#A8E202] focus:shadow-lg focus:shadow-[#A8E202]/20 focus:ring-2 focus:ring-[#A8E202]/20 rounded-xl transition-all" style={{
                    fontSize: 'clamp(16px, 3vw, 20px)'
                  }} />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <p className="text-gray-300 text-center leading-relaxed break-words" style={{
              fontSize: 'clamp(12px, 2.2vw, 14px)'
            }}>
                  Digite o código de 6 dígitos enviado por WhatsApp
                </p>
              </div>
            </>}

          {/* Action Buttons */}
          {otpSent && <div className="flex flex-col gap-3 sm:gap-4">
              <button type="submit" disabled={loading || otpCode.length !== 6} className="w-full bg-[#A8E202] text-white rounded-xl font-semibold hover:bg-[#96CC02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] min-h-[48px] sm:min-h-[52px] lg:min-h-[56px] flex items-center justify-center" style={{
            fontSize: 'clamp(14px, 2.6vw, 16px)'
          }}>
                {loading ? <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div> : 'Verificar Código'}
              </button>
              
              <div className="text-center">
                <button type="button" onClick={() => {
              setOtpSent(false);
              setOtpCode('');
            }} className="text-[#A8E202] hover:text-[#96CC02] transition-colors font-medium underline-offset-4 hover:underline min-h-[44px] flex items-center justify-center mx-auto px-4" style={{
              fontSize: 'clamp(12px, 2.2vw, 14px)'
            }}>
                  Alterar número
                </button>
              </div>
            </div>}
        </form>
      </div>
    </div>;
};
export default AuthModal;