
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const Auth = () => {
  const navigate = useNavigate();
  const { signedIn, loading: authLoading } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  
  // Rediriger si déjà connecté
  useEffect(() => {
    if (signedIn && !authLoading) {
      navigate('/');
    }
  }, [signedIn, authLoading, navigate]);
  
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn(loginData.email, loginData.password);
      
      if (result) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      // Toast error is handled in the service
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await signUp(
        signupData.email, 
        signupData.password, 
        {
          first_name: signupData.firstName,
          last_name: signupData.lastName
        }
      );
      
      if (result) {
        // Rediriger vers la page de profil après inscription réussie
        navigate('/profile');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-intestitrack-blue" />
      </div>
    );
  }
  
  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="border-intestitrack-blue/20">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">IntestiTrack</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour suivre votre santé intestinale
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="votre@email.com"
                    value={loginData.email}
                    onChange={e => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <a 
                      href="#" 
                      className="text-sm text-intestitrack-blue hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        // TODO: Implement password reset
                      }}
                    >
                      Mot de passe oublié?
                    </a>
                  </div>
                  <Input 
                    id="login-password" 
                    type="password"
                    value={loginData.password}
                    onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-intestitrack-blue hover:bg-intestitrack-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4 mr-2" />
                  )}
                  Se connecter
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignupSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-firstname">Prénom</Label>
                    <Input 
                      id="signup-firstname" 
                      placeholder="Prénom"
                      value={signupData.firstName}
                      onChange={e => setSignupData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-lastname">Nom</Label>
                    <Input 
                      id="signup-lastname" 
                      placeholder="Nom"
                      value={signupData.lastName}
                      onChange={e => setSignupData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="votre@email.com"
                    value={signupData.email}
                    onChange={e => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={signupData.password}
                    onChange={e => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirmer le mot de passe</Label>
                  <Input 
                    id="signup-confirm-password" 
                    type="password"
                    value={signupData.confirmPassword}
                    onChange={e => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-intestitrack-blue hover:bg-intestitrack-blue/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Créer un compte
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
