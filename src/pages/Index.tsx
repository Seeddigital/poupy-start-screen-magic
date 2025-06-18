
const Index = () => {
  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        backgroundImage: `url('/lovable-uploads/f3ee6670-5552-48cc-adb1-a46a742158df.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Botão de login no canto superior direito */}
      <div className="absolute top-8 right-8 z-10">
        <button className="w-16 h-16 bg-[#a8e202] rounded-full flex items-center justify-center text-black text-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
          →
        </button>
      </div>
      
      {/* Página limpa com apenas a imagem de fundo */}
    </div>
  );
};

export default Index;
