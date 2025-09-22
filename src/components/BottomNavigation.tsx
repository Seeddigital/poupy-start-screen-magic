
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavigationProps {
  onAddTransaction?: () => void;
}

const BottomNavigation = ({ onAddTransaction }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      icon: '/lovable-uploads/a67da8b5-f0b3-40ef-b607-f9f4b63b92ef.png',
      alt: 'Home'
    },
    {
      path: '/transactions',
      icon: '/lovable-uploads/61b0f927-79ec-4370-989a-00a94c406874.png',
      alt: 'Transactions'
    },
    {
      path: '/add',
      icon: '/lovable-uploads/6995c97d-5e23-40a7-bc6f-34dee745330b.png',
      alt: 'Add',
      isAddButton: true
    },
    {
      path: '/recurring-expenses',
      icon: '/lovable-uploads/8d5f4719-9c26-44b4-9b3a-7073a35f8ce7.png',
      alt: 'Fixed Expenses'
    },
    {
      path: '/learning',
      icon: '/lovable-uploads/cd861024-bba0-4c8d-ada9-dbc07070e800.png',
      alt: 'Learning'
    }
  ];

  const handleNavigation = (path: string) => {
    if (path === '/add') {
      if (onAddTransaction) {
        onAddTransaction();
      }
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 mx-auto max-w-sm">
      <div 
        className="bg-black/40 backdrop-blur-md rounded-3xl px-6 py-4"
        style={{ 
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isAddButton = item.isAddButton;
            
            return (
              <button 
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  transition-all transform hover:scale-105
                  ${isAddButton 
                    ? 'p-4 bg-[#D1FF00] rounded-full text-black hover:bg-[#B8E600]' 
                    : `p-3 ${isActive ? '' : 'opacity-60'}`
                  }
                `}
              >
                <img 
                  src={item.icon} 
                  alt={item.alt} 
                  className={isAddButton ? "w-7 h-7" : "w-6 h-6"}
                />
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
