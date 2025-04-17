
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, User, MessageSquare } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { signOut } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSignOut = async () => {
    const success = await signOut();
    if (success) {
      navigate('/auth');
    }
  };
  
  return (
    <div className="border-b sticky top-0 bg-background z-10">
      <div className="flex h-16 items-center px-4 justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/logo-placeholder.svg" 
            alt="IntestiTrack Logo" 
            className="h-8 w-8 mr-2"
          />
          <span className="font-semibold text-lg">IntestiTrack</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/chat')}
            className="relative"
            title="Assistant IA"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
              >
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-1 py-4">
                <Link
                  to="/"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Accueil
                </Link>
                <Link
                  to="/add"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Ajouter
                </Link>
                <Link
                  to="/history"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Historique
                </Link>
                <Link
                  to="/stats"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Statistiques
                </Link>
                <Link
                  to="/chat"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Assistant IA
                </Link>
                <Link
                  to="/rewards"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Récompenses
                </Link>
                <Link
                  to="/faq"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  FAQ
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-lg font-medium hover:bg-muted rounded-md"
                >
                  Profil
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
