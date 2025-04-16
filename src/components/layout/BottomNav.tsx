
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircleUser, Home, BarChart, Clock, Award } from 'lucide-react';

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/history', icon: Clock, label: 'Historique' },
    { path: '/stats', icon: BarChart, label: 'Stats' },
    { path: '/rewards', icon: Award, label: 'Récompenses' },
    { path: '/profile', icon: CircleUser, label: 'Profil' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4 z-50">
      <div className="flex justify-around items-center max-w-xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const IconComponent = item.icon;
          
          return (
            <button
              key={item.path}
              className={`flex flex-col items-center p-1 ${
                isActive ? 'text-intestitrack-blue' : 'text-gray-500'
              }`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
