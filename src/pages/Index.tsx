

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
      {/* Logo no canto inferior esquerdo */}
      <div className="absolute bottom-8 left-8 z-10">
        <img 
          src="/lovable-uploads/2f3aebd9-efad-4886-8ce5-2d0b5dfc408d.png" 
          alt="Logo" 
          className="h-16 w-auto"
        />
      </div>

      {/* Texto principal centralizado */}
      <div className="text-center z-10">
        <h1 className="text-8xl md:text-9xl font-bold text-[#a8e202] mb-4 leading-none">
          poupy!
        </h1>
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-wider">
          PARA<br />
          O SEU<br />
          FUTURO
        </h2>
      </div>

      {/* Botão de login no canto inferior direito */}
      <div className="absolute bottom-8 right-8 z-10">
        <button className="w-16 h-16 bg-[#a8e202] rounded-full flex items-center justify-center text-black text-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
          →
        </button>
      </div>
      
      {/* Página limpa com apenas a imagem de fundo */}
    </div>
  );
};

export default Index;

