
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
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="500">
            Авторизация
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Введите учетные данные для входа в систему
          </Typography>
          {window.location.href.includes('lovableproject.com') && (
            <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
              В демо-режиме используйте:
              <br />
              Логин: <strong>dev</strong>
              <br />
              Пароль: <strong>dev</strong>
            </Alert>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
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
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Войти"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
