
import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import { login, isAuthenticated } from '../services/authService';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username, password });
      toast({
        title: "Успешная авторизация",
        description: "Вы успешно вошли в систему",
      });
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Неверное имя пользователя или пароль');
      toast({
        variant: "destructive",
        title: "Ошибка авторизации",
        description: "Неверное имя пользователя или пароль",
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if already logged in
  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: '12px',
          background: 'rgba(30, 30, 35, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
        }}
        className="dark-glass"
      >
        <Box textAlign="center" mb={4}>
          <Typography 
            variant="h4" 
            component="h1" 
            fontWeight="500"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)',
              letterSpacing: '0.02em'
            }}
          >
            Авторизация
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              mt: 1
            }}
          >
            Введите учетные данные для входа в систему
          </Typography>
          {window.location.href.includes('lovableproject.com') && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 2, 
                textAlign: 'left',
                backgroundColor: 'rgba(25, 118, 210, 0.15)',
                color: 'rgb(166, 213, 250)',
                '& .MuiAlert-icon': {
                  color: 'rgb(166, 213, 250)'
                }
              }}
            >
              В демо-режиме используйте:
              <br />
              Логин: <strong>dev</strong>
              <br />
              Пароль: <strong>dev</strong>
            </Alert>
          )}
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              backgroundColor: 'rgba(211, 47, 47, 0.15)',
              color: 'rgb(250, 179, 174)',
              '& .MuiAlert-icon': {
                color: 'rgb(250, 179, 174)'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Имя пользователя"
            fullWidth
            margin="normal"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.6)' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(90, 160, 255)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
          />
          
          <TextField
            label="Пароль"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputLabelProps={{
              style: { color: 'rgba(255, 255, 255, 0.6)' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&.Mui-focused fieldset': {
                  borderColor: 'rgb(90, 160, 255)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
              },
            }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ 
              mt: 3, 
              mb: 2, 
              borderRadius: '8px',
              padding: '12px',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #4158D0 0%, #C850C0 100%)',
              boxShadow: '0 4px 12px rgba(192, 80, 192, 0.3)',
              fontSize: '1rem',
              fontWeight: '500',
              '&:hover': {
                background: 'linear-gradient(90deg, #3a4ebf 0%, #b745af 100%)',
                boxShadow: '0 6px 16px rgba(192, 80, 192, 0.4)',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Войти"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
