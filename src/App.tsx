
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";
import TaskManager from "./pages/TaskManager";
import TaskDetail from "./pages/TaskDetail";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

// Создаем компонент-обертку для применения MUI темы на основе ThemeContext
const ThemedApp = () => {
  const { isDarkMode } = useTheme();
  
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#4158D0',
      },
      secondary: {
        main: '#C850C0',
      },
      background: {
        default: isDarkMode ? '#121212' : '#f5f5f5',
        paper: isDarkMode ? '#1e1e24' : '#ffffff',
      },
      text: {
        primary: isDarkMode ? '#f5f5f5' : '#121212',
        secondary: isDarkMode ? '#b0b0b0' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '8px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode ? 'rgba(30, 30, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <TaskManager />
              </ProtectedRoute>
            } />
            <Route path="/task/:taskId" element={
              <ProtectedRoute>
                <TaskDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MuiThemeProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
