const Index = () => {
  return <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden flex items-center justify-center">
      {/* Main character - 3D pig */}
      <div className="absolute top-1/4 right-8 z-10">
        <img src="/lovable-uploads/9e2f2d5a-bbb6-43f2-a0ad-1ae5f8936a39.png" alt="Poupy mascot" className="w-80 h-auto object-contain" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-between h-full w-full px-8 py-20">
        <div className="max-w-md">
          {/* Logo/Title */}
          <div className="mb-8">
            
            <div className="text-white text-xl font-bold uppercase tracking-wide">
              
              
              
            </div>
          </div>
        </div>
        
        {/* Action button - positioned at bottom */}
        <div className="flex justify-start px-0 mx-0 py-0 my-0">
          <button className="text-black w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg py-0 mx-[104px] text-left rounded-full my-[34px] bg-[b#A8E202] bg-[#a8e202]">
            →
          </button>
        </div>
      </div>
    </div>;
};
export default Index;