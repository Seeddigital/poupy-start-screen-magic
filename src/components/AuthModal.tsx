import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  children: React.ReactNode;
}

const AuthModal = ({ children }: AuthModalProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');

    // Limita a 11 dígitos (DDD + 9 dígitos)
    const limited = numbers.slice(0, 11);

    // Aplica a formatação (11) 91234-5678
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 3) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)}${limited.slice(3)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)}${limited.slice(3, 7)}-${limited.slice(7)}`;
    }
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  // Validação do telefone brasileiro
  const isPhoneValid = () => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11 && numbers.startsWith('11'); // Exemplo com DDD 11
  };
  const isPasswordValid = () => {
    return password.length >= 6;
  };
  const isFormValid = () => {
    return isPhoneValid() && isPasswordValid();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast({
        title: "😅 Ops! Verifique seus dados",
        description: "Certifique-se de que o número e senha estão corretos.",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);

    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "🎉 Bem-vindo ao Poupy!",
        description: "Login realizado com sucesso!"
      });
    }, 1500);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[95vw] w-full max-h-[95vh] h-auto overflow-hidden">
        {/* Container principal responsivo */}
        <div className="relative w-full min-h-screen bg-black overflow-hidden">
          {/* Imagem de fundo responsiva */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} 
          />
          
          {/* Gradientes responsivos */}
          <div 
            className="absolute bottom-0 left-0 w-full h-1/2"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'
            }} 
          />
          <div 
            className="absolute top-0 right-0 w-full h-1/2 rotate-180"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'
            }} 
          />

          {/* Logo Poupy - posicionamento responsivo */}
          <div className="absolute bottom-48 sm:bottom-56 md:bottom-60 left-4 sm:left-6 md:left-8 max-w-[280px] sm:max-w-[320px]">
            {/* Imagem do logo "poupy" */}
            <div className="w-full max-w-[200px] sm:max-w-[240px]">
              <img 
                src="/lovable-uploads/3e79f112-8b63-419b-b03c-370cdc90cefc.png" 
                alt="Poupy" 
                className="w-full h-auto object-contain" 
              />
            </div>
          </div>

          {/* Box de Login responsivo */}
          <form 
            onSubmit={handleSubmit} 
            className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] md:w-[412px] max-w-[412px]"
          >
            <div className="w-full bg-white rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
              
              {/* Campo de Telefone */}
              <div className="relative">
                <div className="w-full h-[56px] sm:h-[60px] md:h-[66px] bg-black bg-opacity-[0.03] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] flex items-center px-3 sm:px-4">
                  {/* Ícone da bandeira do Brasil */}
                  <div className="w-8 h-6 sm:w-10 sm:h-7 md:w-12 md:h-9 mr-2 sm:mr-3 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    BR
                  </div>
                  <Input 
                    type="tel" 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    placeholder="(11) 91234-5678" 
                    className="border-none bg-transparent text-black placeholder:text-black placeholder:opacity-40 text-base sm:text-lg font-medium h-full flex-1" 
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: 'inherit',
                      letterSpacing: '-0.02em'
                    }} 
                    maxLength={15} 
                  />
                </div>
              </div>

              {/* Campos Senha e Botão */}
              <div className="flex gap-3 sm:gap-4">
                {/* Campo de Senha */}
                <div className="flex-1 relative">
                  <div className="w-full h-[56px] sm:h-[60px] md:h-[66px] bg-black bg-opacity-[0.03] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] flex items-center px-3 sm:px-4">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="Senha" 
                      className="border-none bg-transparent text-black placeholder:text-black placeholder:opacity-40 text-base sm:text-lg font-medium h-full flex-1" 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: 'inherit',
                        letterSpacing: '-0.02em'
                      }} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="ml-2 text-black opacity-40 hover:opacity-60"
                    >
                      {showPassword ? <EyeOff size={18} className="sm:w-5 sm:h-5" /> : <Eye size={18} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Botão Avançar responsivo */}
                <Button 
                  type="submit" 
                  disabled={!isFormValid() || isLoading} 
                  className={`w-[80px] sm:w-[90px] md:w-[100px] h-[56px] sm:h-[60px] md:h-[66px] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] flex items-center justify-center transition-all ${
                    isFormValid() && !isLoading 
                      ? 'bg-[#A8E202] hover:bg-[#95cc02] text-black' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={20} className="sm:w-6 sm:h-6 text-black" strokeWidth={3} />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
