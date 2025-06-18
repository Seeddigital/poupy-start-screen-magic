
import { useState } from 'react';
import AuthModal from '@/components/AuthModal';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center" style={{
      backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
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
        <button 
          onClick={handleLoginClick}
          className="w-16 h-16 bg-[#a8e202] rounded-full flex items-center justify-center text-black text-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          →
        </button>
      </div>
      
      {/* Modal de Autenticação */}
      <AuthModal isOpen={showAuth} onClose={handleCloseAuth} />
      
      {/* Página limpa com apenas a imagem de fundo */}
    </div>
  );
};

export default Index;
