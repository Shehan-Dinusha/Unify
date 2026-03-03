import React from 'react';
import LandingLayout from '../components/layout/LandingLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <LandingLayout>
      <div className="relative flex items-center justify-center min-h-[calc(100vh-80px)]"> {/* Adjust height for header/footer if needed */}
        
        <LoginForm />
      </div>
    </LandingLayout>
  );
};

export default LoginPage;
