
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check authentication on mount and if it fails, show a toast
    if (!isAuthenticated()) {
      toast({
        variant: "destructive",
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему для доступа к этой странице"
      });
    }
  }, [toast]);

  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
