import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from 'sonner';

const Index = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, sendOTP } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      console.log('User found on index, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Phone number validation
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !isValidPhoneNumber(phoneNumber)) {
      toast.error('Digite um número válido');
      return;
    }

    setLoading(true);
    try {
      const apiPhoneNumber = '55' + phoneNumber.replace(/\s+/g, '');
      const result = await sendOTP(apiPhoneNumber);
      
      if (result.success) {
        toast.success('Código enviado via WhatsApp!');
        // Navigate to a verification page or show verification modal
        navigate('/dashboard'); // Temporary navigation
      } else {
        toast.error(result.error || 'Erro ao enviar código');
      }
    } catch (error) {
      toast.error('Erro ao enviar código');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: `url('/lovable-uploads/6cb3b08a-4e20-4f55-a903-7eeeb09c64d8.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        {/* Brand Text */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-black text-[#A8E202] mb-2">
            poupy!
          </h1>
          <p className="text-white text-xl md:text-2xl font-bold tracking-wide">
            PARA<br />
            O SEU<br />
            FUTURO
          </p>
        </div>
      </div>

      {/* Phone Input Section */}
      <div className="px-6 pb-16">
        <div className="max-w-sm mx-auto">
          {/* Integrated Phone Input */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-4">
            <div className="flex items-center p-4">
              {/* Brazil flag and country code */}
              <div className="flex items-center mr-3">
                <span className="text-2xl mr-2">🇧🇷</span>
              </div>
              
              {/* Phone input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(11) 91234 5678"
                className="flex-1 text-lg text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400"
              />
              
              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !isValidPhoneNumber(phoneNumber)}
                className="bg-[#A8E202] hover:bg-[#96CC02] text-black rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg px-6 py-3 transform hover:scale-105 active:scale-95 ml-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xl">→</span>
                )}
              </button>
            </div>
          </div>
          
          {/* Validation Message */}
          {phoneNumber && !isValidPhoneNumber(phoneNumber) && (
            <p className="text-red-500 text-sm font-medium ml-4">
              Número inválido
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;