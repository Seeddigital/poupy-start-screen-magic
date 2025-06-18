
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ArrowRight } from 'lucide-react';

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
    // Aqui você implementaria a lógica de autenticação
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md mx-4">
        {/* Background similar to the image */}
        <div className="relative bg-gradient-to-b from-purple-600 via-purple-700 to-purple-900 rounded-3xl p-8 text-white overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <X size={24} />
          </button>

          {/* Character/Avatar area */}
          <div className="text-center mb-8 mt-4">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4">
              <div className="text-6xl">🐷</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#a8e202] mb-2">poupy</h1>
            <p className="text-lg text-white">PARA</p>
            <p className="text-lg text-white">O SEU</p>
            <p className="text-lg text-white font-bold">FUTURO</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 text-black">
            {/* Phone number input */}
            <div className="mb-4">
              <div className="flex items-center border border-gray-300 rounded-lg p-3">
                <div className="flex items-center mr-3">
                  <span className="text-2xl mr-2">🇧🇷</span>
                  <span className="text-gray-600">(11)</span>
                </div>
                <Input
                  type="tel"
                  placeholder="91234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-0 p-0 text-gray-600 placeholder-gray-400 focus:ring-0"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="mb-6">
              <div className="flex items-center">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-l-lg p-3 text-gray-600 placeholder-gray-400"
                />
                <Button
                  type="submit"
                  className="bg-[#a8e202] hover:bg-[#95cc02] text-black rounded-r-lg rounded-l-none px-6 py-3 h-auto"
                >
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
