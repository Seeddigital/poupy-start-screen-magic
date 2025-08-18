
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
      <div className="absolute inset-0 welcome-overlay"></div>
      
      {/* Letreiro neon na borda esquerda */}
      <div className="absolute left-0 top-0 w-[14%] h-full overflow-hidden">
        <div className="relative w-full h-full">
          {/* Gradiente neon */}
          <div className="absolute inset-0 neon-gradient"></div>
          {/* Glow effect */}
          <div className="absolute inset-0 neon-gradient neon-glow"></div>
        </div>
      </div>

      {/* Mascote 3D na metade direita */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[75vh] flex items-center justify-center">
        <img 
          alt="Mascote 3D" 
          className="h-full w-auto object-contain" 
          src="/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png" 
        />
      </div>

      {/* Conteúdo inferior esquerdo */}
      <div className="absolute bottom-6 left-6 z-20 flex items-end gap-4">
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
          aria-label="Começar"
        >
          <ArrowRight 
            size={20} 
            className="text-text-black" 
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
