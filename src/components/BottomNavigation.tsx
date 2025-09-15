
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CreditCard, Plus, PieChart, GraduationCap } from 'lucide-react';

interface BottomNavigationProps {
  onAddTransaction?: () => void;
}

const BottomNavigation = ({ onAddTransaction }: BottomNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      Icon: Home,
      alt: 'Home'
    },
    {
      path: '/transactions',
      Icon: CreditCard,
      alt: 'Transactions'
    },
    {
      path: '/add',
      Icon: Plus,
      alt: 'Add',
      isAddButton: true
    },
    {
      path: '/categories',
      Icon: PieChart,
      alt: 'Categories'
    },
    {
      path: '/learning',
      Icon: GraduationCap,
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
            const { Icon } = item;
            
            return (
              <button 
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  transition-all transform hover:scale-105
                  ${isAddButton 
                    ? 'p-4 bg-[#D1FF00] rounded-full text-black hover:bg-[#B8E600]' 
                    : `p-3 ${isActive ? 'text-white' : 'opacity-60 text-white/60'}`
                  }
                `}
              >
                <Icon 
                  size={isAddButton ? 28 : 24}
                  className={isAddButton ? "" : ""}
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
