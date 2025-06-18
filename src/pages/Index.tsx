
const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden flex items-center justify-center">
      {/* Background neon effects */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-pink-500/30 to-transparent"></div>
        <div className="absolute left-8 top-1/4 w-4 h-32 bg-yellow-400 rounded-full blur-sm opacity-80"></div>
        <div className="absolute left-8 top-1/2 w-4 h-24 bg-pink-400 rounded-full blur-sm opacity-80"></div>
        <div className="absolute left-8 bottom-1/4 w-4 h-28 bg-purple-400 rounded-full blur-sm opacity-80"></div>
      </div>

      {/* Main character - 3D pig */}
      <div className="absolute top-1/4 right-8 z-10">
        <img 
          src="/lovable-uploads/9e2f2d5a-bbb6-43f2-a0ad-1ae5f8936a39.png" 
          alt="Poupy mascot"
          className="w-80 h-auto object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-start justify-center h-full w-full px-8 pb-20">
        <div className="max-w-md">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-7xl font-black text-lime-400 leading-none mb-2">
              poupy!
            </h1>
            <div className="text-white text-xl font-bold uppercase tracking-wide">
              <div>PARA</div>
              <div>O SEU</div>
              <div>FUTURO</div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="flex justify-start">
            <button className="bg-lime-400 hover:bg-lime-300 text-black w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg">
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
