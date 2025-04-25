
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="mb-8 flex items-center gap-2">
        <Shield className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-semibold">SensiScan</span>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
