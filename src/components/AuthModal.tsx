
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  children: React.ReactNode;
}

const countries = [
  { code: '+55', flag: '🇧🇷', name: 'Brasil', format: '(##) #####-####', length: 11 },
  { code: '+1', flag: '🇺🇸', name: 'Estados Unidos', format: '(###) ###-####', length: 10 },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', format: '### ### ###', length: 9 },
  { code: '+33', flag: '🇫🇷', name: 'França', format: '## ## ## ## ##', length: 10 },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido', format: '#### ### ####', length: 10 },
  { code: '+49', flag: '🇩🇪', name: 'Alemanha', format: '### ### ####', length: 10 },
];

const AuthModal = ({ children }: AuthModalProps) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Brasil por padrão
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função para formatar o telefone baseado no país selecionado
  const formatPhone = (value: string, country: typeof countries[0]) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita ao número máximo de dígitos do país
    const limited = numbers.slice(0, country.length);
    
    // Aplica formatação específica por país
    if (country.code === '+55') { // Brasil
      if (limited.length <= 2) {
        return limited;
      } else if (limited.length <= 3) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
      } else if (limited.length <= 7) {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)}${limited.slice(3)}`;
      } else {
        return `(${limited.slice(0, 2)}) ${limited.slice(2, 3)}${limited.slice(3, 7)}-${limited.slice(7)}`;
      }
    } else if (country.code === '+1') { // EUA
      if (limited.length <= 3) {
        return limited;
      } else if (limited.length <= 6) {
        return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
      } else {
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
      }
    } else {
      // Formatação genérica para outros países
      return limited;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value, selectedCountry);
    setPhone(formatted);
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setPhone(''); // Limpa o campo ao trocar de país
    }
  };

  // Validação do telefone baseada no país
  const isPhoneValid = () => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === selectedCountry.length;
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
        {/* Container principal com scroll vertical permitido */}
        <div className="relative w-full min-h-screen bg-black overflow-y-auto">
          {/* Seção da imagem de fundo - máx 60% da altura da tela */}
          <div className="relative w-full h-[60vh] max-h-[60vh] overflow-hidden">
            {/* Imagem de fundo responsiva */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} 
            />
            
            {/* Gradientes para efeito visual */}
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

            {/* Logo Poupy - posicionado dentro da seção da imagem */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 max-w-[200px] sm:max-w-[240px] md:max-w-[280px]">
              <img 
                src="/lovable-uploads/3e79f112-8b63-419b-b03c-370cdc90cefc.png" 
                alt="Poupy" 
                className="w-full h-auto object-contain" 
              />
            </div>
          </div>

          {/* Seção do formulário - sempre visível */}
          <div className="relative w-full bg-black pt-4 pb-6 px-4 sm:px-6">
            <form 
              onSubmit={handleSubmit} 
              className="w-full max-w-[412px] mx-auto"
            >
              <div className="w-full bg-white rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                
                {/* Campo de Telefone com Dropdown de País */}
                <div className="relative">
                  <div className="w-full h-[56px] sm:h-[60px] md:h-[66px] bg-black bg-opacity-[0.03] rounded-[15px] sm:rounded-[18px] md:rounded-[20px] flex items-center px-3 sm:px-4 gap-2">
                    {/* Dropdown de países */}
                    <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
                      <SelectTrigger className="w-auto border-none bg-transparent h-full p-0 focus:ring-0 focus:ring-offset-0">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-lg sm:text-xl">{selectedCountry.flag}</span>
                          <span className="text-sm sm:text-base font-medium text-black opacity-60">{selectedCountry.code}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg">
                        {countries.map((country) => (
                          <SelectItem 
                            key={country.code} 
                            value={country.code}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{country.flag}</span>
                              <span className="font-medium">{country.code}</span>
                              <span className="text-gray-600">{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Separador visual */}
                    <div className="w-px h-6 bg-black opacity-20"></div>
                    
                    {/* Campo de telefone */}
                    <Input 
                      type="tel" 
                      value={phone} 
                      onChange={handlePhoneChange} 
                      placeholder={selectedCountry.code === '+55' ? '(11) 91234-5678' : 'Número de telefone'} 
                      className="border-none bg-transparent text-black placeholder:text-black placeholder:opacity-40 text-base sm:text-lg font-medium h-full flex-1" 
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        fontSize: 'inherit',
                        letterSpacing: '-0.02em'
                      }} 
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
