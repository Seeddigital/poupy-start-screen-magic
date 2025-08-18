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
  return <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
    backgroundImage: `url('/lovable-uploads/12fdb585-4ebe-45f7-a4bc-ba2bbcada589.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
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