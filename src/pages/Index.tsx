
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      console.log('User found on index, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden welcome-gradient">
      {/* Overlay para legibilidade do texto */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      {/* Elementos neon decorativos à esquerda */}
      <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-purple-500/20 to-transparent"></div>

      {/* Hero do mascote full-bleed à direita */}
      <div className="absolute right-0 top-0 w-full h-screen">
        <img 
          alt="Mascote Poupy" 
          className="w-full h-full object-cover object-center" 
          src="/lovable-uploads/7901496c-163f-40fb-a46f-ce0d38632d69.png" 
        />
      </div>

      {/* Conteúdo inferior esquerdo */}
      <div className="absolute bottom-6 left-6 z-20 flex items-end gap-4 max-[479px]:max-w-none min-[480px]:max-w-[65%]">
        {/* Bloco de texto */}
        <div className="flex flex-col">
          {/* Linha 1: poupy */}
          <div className="poupy-text text-[44px] max-[340px]:text-[40px] leading-none mb-1">
            poupy
          </div>
          
          {/* Linhas 2-4: PARA O SEU FUTURO */}
          <div className="flex flex-col future-text text-[22px] leading-none">
            <span>PARA</span>
            <span>O SEU</span>
            <span>FUTURO</span>
          </div>
        </div>

        {/* Botão CTA circular */}
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="cta-button w-14 h-14 max-[340px]:w-12 max-[340px]:h-12 rounded-full flex items-center justify-center shrink-0"
          aria-label="Continuar"
        >
          <ArrowRight 
            size={20} 
            className="text-[#0B0B0B]" 
            strokeWidth={2}
          />
        </button>
      </div>
      
      {/* Modal de autenticação */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;
