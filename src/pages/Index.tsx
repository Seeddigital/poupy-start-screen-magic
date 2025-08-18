
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="min-h-screen relative overflow-hidden" style={{
      backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Neon decorativo estreito à esquerda */}
      <div className="absolute left-0 top-0 w-[12%] h-full z-[1]">
        <div className="w-full h-full bg-gradient-to-r from-[#FF4DD2] to-[#7B5CFF] opacity-30 blur-[28px]"></div>
      </div>

      {/* Overlay escuro no terço inferior para contraste do texto */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-black/60 to-transparent z-[2]"></div>

      {/* Bloco de marca no canto inferior esquerdo */}
      <div className="absolute bottom-6 left-6 z-10 flex items-end gap-4">
        {/* Texto da marca */}
        <div className="flex flex-col">
          {/* "poupy" invertido */}
          <div 
            className="text-[#C4FF00] font-black text-[28px] leading-none tracking-[-0.01em] mb-1"
            style={{ 
              transform: 'rotate(180deg) skew(-6deg, 0deg)',
              fontFamily: 'Inter, SF Pro, system-ui',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            poupy
          </div>
          
          {/* Linhas empilhadas */}
          <div className="text-white font-bold text-[14px] leading-[100%] tracking-normal">
            <div>PARA</div>
            <div>O SEU</div>
            <div>FUTURO</div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => setIsAuthModalOpen(true)}
          className="w-[48px] h-[48px] bg-[#C4FF00] rounded-full flex items-center justify-center text-[#0B0B0B] transition-all duration-200 hover:brightness-[1.06] active:scale-[0.98] mb-1"
          aria-label="Continuar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
