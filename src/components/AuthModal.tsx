
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { phoneNumber, password });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Container principal com dimensões do iPhone */}
      <div className="relative w-[440px] h-[956px] bg-black overflow-hidden rounded-3xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
        >
          <X size={24} />
        </button>

        {/* Imagem de fundo */}
        <div 
          className="absolute w-[658px] h-[986px] -left-[109px] -top-[194px]"
          style={{
            backgroundImage: `url('/lovable-uploads/902cfe0a-0896-4c82-9b75-b2249aff1df5.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        {/* Gradiente inferior esquerdo */}
        <div 
          className="absolute w-[531px] h-[365px] -left-[33px] top-[362px]"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)'
          }}
        />

        {/* Gradiente superior direito (rotacionado) */}
        <div 
          className="absolute w-[531px] h-[675px] left-[498px] top-[154px]"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)',
            transform: 'rotate(180deg)'
          }}
        />

        {/* Texto principal "PARA O SEU FUTURO" */}
        <div className="absolute left-[23px] top-[507px] w-[296px] h-[170px]">
          <div 
            className="absolute left-[124px] top-[30px] w-[195px] h-[140px] text-white font-bold text-[38px] leading-[35px] uppercase tracking-[-0.02em]"
            style={{ fontFamily: 'Inter' }}
          >
            para o seu futuro
          </div>
        </div>

        {/* Logo "poupy" com formas geométricas */}
        <div className="absolute left-[23px] top-[507px] w-[241px] h-[91px]">
          {/* Formas do logo poupy */}
          <div 
            className="absolute w-[52.1px] h-[62.74px] left-[182px] top-[6px] bg-[#A8E202]"
            style={{ transform: 'matrix(0.99, -0.12, 0.12, 0.99, 0, 0)' }}
          />
          <div 
            className="absolute w-[52.66px] h-[63.5px] left-[138px] top-[10px] bg-[#A8E202]"
            style={{ transform: 'matrix(0.99, -0.12, 0.12, 0.99, 0, 0)' }}
          />
          <div 
            className="absolute w-[45.62px] h-[43.66px] left-[100px] top-[16px] bg-[#A8E202]"
            style={{ transform: 'matrix(0.99, -0.12, 0.12, 0.99, 0, 0)' }}
          />
          <div 
            className="absolute w-[52.66px] h-[63.5px] left-[0px] top-[27px] bg-[#A8E202]"
            style={{ transform: 'matrix(0.99, -0.12, 0.12, 0.99, 0, 0)' }}
          />
          <div 
            className="absolute w-[44.93px] h-[47.27px] left-[57px] top-[18px] bg-[#A8E202]"
          />
        </div>

        {/* Box de Login */}
        <div className="absolute left-[14px] top-[729px] w-[412px] h-[210px]">
          {/* Fundo branco do box */}
          <div className="absolute w-[412px] h-[210px] bg-white rounded-[30px]" />

          {/* Input de telefone */}
          <div className="absolute left-[26px] top-[26px] w-[360px] h-[66px]">
            <div 
              className="absolute w-[360px] h-[66px] rounded-[20px]"
              style={{ background: '#000000', opacity: 0.03 }}
            />
            
            {/* Bandeira do Brasil */}
            <div className="absolute left-[16px] top-[15px] w-[48px] h-[36px] bg-green-500 rounded-[10px] flex items-center justify-center text-2xl">
              🇧🇷
            </div>
            
            {/* Texto do telefone */}
            <div 
              className="absolute left-[78px] top-[24px] text-black text-[18px] font-medium leading-[17px] tracking-[-0.02em]"
              style={{ fontFamily: 'Inter', opacity: 0.4 }}
            >
              (11) 91234 5678
            </div>
          </div>

          {/* Input de senha */}
          <div className="absolute left-[26px] top-[118px] w-[246px] h-[66px]">
            <div 
              className="absolute w-[246px] h-[66px] rounded-[20px]"
              style={{ background: '#000000', opacity: 0.03 }}
            />
            
            {/* Texto "Senha" */}
            <div 
              className="absolute left-[26px] top-[24px] text-black text-[18px] font-medium leading-[17px] tracking-[-0.02em]"
              style={{ fontFamily: 'Inter', opacity: 0.4 }}
            >
              Senha
            </div>
          </div>

          {/* Botão verde com seta */}
          <div className="absolute right-[26px] top-[118px] w-[100px] h-[66px] bg-[#A8E202] rounded-[20px] flex items-center justify-center">
            <div className="w-[25px] h-[3px] bg-black" />
            <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
