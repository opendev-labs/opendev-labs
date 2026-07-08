import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  text?: string;
}

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  className = '',
  variant = 'default',
  size = 'default',
  text = 'Sign in with Google',
}) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse: any) => {
    login(credentialResponse);
    onSuccess?.();
    navigate('/dashboard');
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleError}
      render={(renderProps) => (
        <Button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          variant={variant}
          size={size}
          className={className}
        >
          {text}
        </Button>
      )}
    />
  );
};

export default GoogleLoginButton;
