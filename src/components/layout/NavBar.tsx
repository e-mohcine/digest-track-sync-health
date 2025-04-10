
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function NavBar() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <Link to="/profile">Mon profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/help">Aide</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/" className="ml-2 flex items-center">
            <img src="/logo-placeholder.svg" alt="IntestiTrack Logo" className="h-8 w-8 mr-2" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-intestitrack-blue to-intestitrack-green bg-clip-text text-transparent">
              IntestiTrack
            </h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
