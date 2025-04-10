
import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavBar />
      <main className="flex-1 container mx-auto px-4 py-4 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
