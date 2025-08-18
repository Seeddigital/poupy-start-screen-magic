
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
      {/* Overlay para legibilidade do texto no terço inferior */}
      <div className="absolute inset-0 welcome-overlay"></div>
      
      {/* Elemento neon decorativo estreito à esquerda */}
      <div className="absolute left-8 top-1/4 w-8 h-64 neon-element"></div>

      {/* Hero do mascote full-bleed à direita */}
      <div className="absolute right-0 top-0 w-1/2 h-screen">
        <img 
          alt="Mascote Poupy" 
          className="w-full h-[75vh] object-cover object-right-center" 
          src="/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png" 
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
