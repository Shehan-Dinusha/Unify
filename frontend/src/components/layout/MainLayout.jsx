
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow p-4">
        <nav className="container mx-auto flex justify-between">
          <div className="font-bold text-xl text-primary">Unify</div>
          <div>
            {/* Navigation Links */}
          </div>
        </nav>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>

      <footer className="bg-gray-100 p-4 text-center">
        <p>&copy; {new Date().getFullYear()} Unify Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
