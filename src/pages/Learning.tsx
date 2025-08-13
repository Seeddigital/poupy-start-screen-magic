
import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Learning = () => {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Como Controlar Gastos",
      description: "Aprenda técnicas eficazes para monitorar e reduzir seus gastos mensais",
      duration: "15 min",
      completed: false,
      thumbnail: "#FF6B35"
    },
    {
      id: 2,
      title: "Planejamento Financeiro",
      description: "Construa um plano financeiro sólido para o seu futuro",
      duration: "25 min",
      completed: true,
      thumbnail: "#3498DB"
    },
    {
      id: 3,
      title: "Investimentos Básicos",
      description: "Primeiros passos no mundo dos investimentos",
      duration: "30 min",
      completed: false,
      thumbnail: "#1ABC9C"
    },
    {
      id: 4,
      title: "Orçamento Familiar",
      description: "Como organizar as finanças de toda a família",
      duration: "20 min",
      completed: false,
      thumbnail: "#9B59B6"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <h1 className="text-xl font-semibold">Aprendizado</h1>
        <div className="w-10"></div>
      </header>

      {/* Course Progress */}
      <div className="px-4 sm:px-6 mb-6">
        <div className="bg-[#A8E202] rounded-2xl p-6">
          <h2 className="text-black text-lg font-semibold mb-2">Seu Progresso</h2>
          <p className="text-gray-700 text-sm mb-3">1 de 4 cursos concluídos</p>
          <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
            <div className="h-full bg-black rounded-full w-1/4 transition-all duration-300"></div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      <div className="px-4 sm:px-6">
        <h3 className="text-white text-lg font-semibold mb-4">Cursos Disponíveis</h3>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-gray-900 rounded-2xl p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: course.thumbnail }}
                >
                  <Play size={24} className="text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium text-base">{course.title}</h4>
                    {course.completed && (
                      <span className="text-[#A8E202] text-xs bg-[#A8E202]/20 px-2 py-1 rounded-full">
                        Concluído
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">{course.duration}</span>
                    <button className="bg-[#A8E202] text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-[#96CC02] transition-colors">
                      {course.completed ? 'Revisar' : 'Começar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;
