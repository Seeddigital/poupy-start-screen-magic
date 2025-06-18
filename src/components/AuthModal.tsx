
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

  // Validação da senha
  const isPasswordValid = () => {
    return password.length >= 6;
  };

  // Verifica se o formulário está válido
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
        description: "Login realizado com sucesso!",
      });
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[440px] w-full h-[956px] overflow-hidden">
        {/* Container principal */}
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
          {/* Imagem de fundo */}
          <div 
            className="absolute w-[658px] h-[986px] -left-[109px] -top-[194px]"
            style={{
              backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Gradientes de overlay */}
          <div 
            className="absolute w-[531px] h-[365px] -left-[33px] top-[362px]"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'
            }}
          />
          <div 
            className="absolute w-[531px] h-[675px] left-[498px] top-[154px] rotate-180"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'
            }}
          />

          {/* Logo Poupy */}
          <div className="absolute left-[23px] top-[507px] w-[296px] h-[170px]">
            {/* Texto "poupy" */}
            <div className="absolute w-[241px] h-[91px] left-0 top-[30px]">
              <div className="text-[#A8E202] font-bold text-4xl tracking-tight">poupy</div>
            </div>
            
            {/* Texto "para o seu futuro" */}
            <div className="absolute left-[124px] top-[30px] w-[195px] h-[140px]">
              <h1 className="font-bold text-[38px] leading-[35px] tracking-tight uppercase text-white">
                para o seu futuro
              </h1>
            </div>
          </div>

          {/* Box de Login */}
          <form onSubmit={handleSubmit} className="absolute left-[14px] top-[729px] w-[412px] h-[210px]">
            <div className="w-full h-full bg-white rounded-[30px] p-6 space-y-4">
              
              {/* Campo de Telefone */}
              <div className="relative">
                <div className="w-full h-[66px] bg-black bg-opacity-[0.03] rounded-[20px] flex items-center px-4">
                  {/* Ícone da bandeira do Brasil */}
                  <div className="w-12 h-9 mr-3 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    BR
                  </div>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 91234-5678"
                    className="border-none bg-transparent text-black placeholder:text-black placeholder:opacity-40 text-lg font-medium h-full flex-1"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Campos Senha e Botão */}
              <div className="flex gap-4">
                {/* Campo de Senha */}
                <div className="flex-1 relative">
                  <div className="w-full h-[66px] bg-black bg-opacity-[0.03] rounded-[20px] flex items-center px-4">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha"
                      className="border-none bg-transparent text-black placeholder:text-black placeholder:opacity-40 text-lg font-medium h-full flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="ml-2 text-black opacity-40 hover:opacity-60"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Botão Avançar */}
                <Button
                  type="submit"
                  disabled={!isFormValid() || isLoading}
                  className={`w-[100px] h-[66px] rounded-[20px] flex items-center justify-center transition-all ${
                    isFormValid() && !isLoading
                      ? 'bg-[#A8E202] hover:bg-[#95cc02] text-black' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight size={25} className="text-black" strokeWidth={3} />
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
