
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('/lovable-uploads/b4be7b86-490c-4039-b0ca-a2fe1701693d.png')`
        }}
      />
      
      {/* Neon glow effects */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400 rounded-full blur-2xl opacity-25"></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-4">
            poupy!
          </h1>
          <p className="text-2xl text-white font-medium mb-2">PARA O SEU</p>
          <p className="text-2xl text-white font-bold">FUTURO</p>
        </div>
        
        <div className="flex justify-center">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
            Começar →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
