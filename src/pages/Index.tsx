import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      console.log('User found on index, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);
  return <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-black">
      {/* poupy text using individual letter images */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="flex items-baseline">
          <img src="/lovable-uploads/e39e3659-fe9b-4784-a37b-9ad5c321a7e8.png" alt="p" className="h-20" />
          <img src="/lovable-uploads/8b03ef02-7a39-4ee8-8d83-e14cbc6ee6aa.png" alt="o" className="h-16" />
          <img src="/lovable-uploads/64e5588c-6a6f-42b5-8d85-0deeb2db5279.png" alt="u" className="h-16" />
          <img src="/lovable-uploads/e39e3659-fe9b-4784-a37b-9ad5c321a7e8.png" alt="p" className="h-20" />
          <img src="/lovable-uploads/af32fedf-9e02-45c0-b389-bb1aad5bffc5.png" alt="y" className="h-20" />
        </div>
        <div className="absolute top-full mt-2 text-white text-sm font-light tracking-widest">
          PARA O SEU FUTURO
        </div>
      </div>

      {/* Logo no canto inferior esquerdo */}
      <div className="absolute bottom-8 left-8 z-10 mx-[29px]">
        <img alt="Logo" className="h-28 w-auto" src="/lovable-uploads/a5f7a3ad-fd73-4d04-979c-aa6192a26233.png" />
      </div>

      {/* Botão de login no canto inferior direito */}
      <div className="absolute bottom-8 right-8 z-10">
        <button onClick={() => setIsAuthModalOpen(true)} className="w-20 h-20 bg-[#a8e202] rounded-full flex items-center justify-center text-black transition-all duration-200 transform hover:scale-105 shadow-lg text-3xl text-left font-bold mx-0 my-[50px]">
          →
        </button>
      </div>
      
      {/* Modal de autenticação */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* Página limpa com apenas a imagem de fundo */}
    </div>;
};
export default Index;