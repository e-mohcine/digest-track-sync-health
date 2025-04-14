
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, PlusCircle, BarChart2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t shadow-md">
      <div className="container mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home />} label="Accueil" isActive={isActive('/')} />
          <NavItem to="/history" icon={<Calendar />} label="Historique" isActive={isActive('/history')} />
          <NavItem 
            to="/add" 
            icon={<PlusCircle className="h-10 w-10 text-intestitrack-blue" />} 
            label="Ajouter" 
            isActive={isActive('/add')} 
            isPrimary 
          />
          <NavItem to="/stats" icon={<BarChart2 />} label="Statistiques" isActive={isActive('/stats')} />
          <NavItem to="/chat" icon={<MessageSquare />} label="Assistant" isActive={isActive('/chat')} />
        </div>
      </div>
    </nav>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isPrimary?: boolean;
}

function NavItem({ to, icon, label, isActive, isPrimary }: NavItemProps) {
  return (
    <Link to={to} className={cn(
      "flex flex-col items-center justify-center px-2 py-1 rounded-md transition-colors",
      isPrimary ? "text-intestitrack-blue animate-bounce-small" : 
      isActive ? "text-intestitrack-blue" : "text-gray-500 hover:text-intestitrack-blue"
    )}>
      <div className={cn(
        "w-full flex justify-center",
        isPrimary ? "-mt-4" : ""
      )}>
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}
