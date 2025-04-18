
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Grid,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TaskTable';
import { fetchTasks } from '../services/apiService';
import { Task, StatusFilter, SortOption } from '../types/types';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Все статусы');
  const [sortOption, setSortOption] = useState<SortOption>('По сроку');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка задач с API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const data = await fetchTasks();
        setTasks(data);
        setLoading(false);
      } catch (error) {
        setError('Ошибка при загрузке задач');
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Ошибка при загрузке задач',
          severity: 'error'
        });
      }
    };

    loadTasks();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleStatusFilterChange = (status: StatusFilter) => {
    setStatusFilter(status);
  };

  const handleSortOptionChange = (option: SortOption) => {
    setSortOption(option);
  };

  const handleEditTask = (task: Task) => {
    // В реальном приложении здесь был бы API запрос
    setSnackbar({
      open: true,
      message: `Редактирование задачи: ${task.task_name}`,
      severity: 'success'
    });
  };

  const handleDeleteTask = (taskId: string) => {
    // В реальном приложении здесь был бы API запрос
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    setSnackbar({
      open: true,
      message: 'Задача успешно удалена',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Фильтрация и сортировка задач при изменении зависимостей
  useEffect(() => {
    let result = [...tasks];
    
    // Применение поискового фильтра
    if (searchQuery) {
      result = result.filter(task => 
        task.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Применение фильтра по статусу
    if (statusFilter !== 'Все статусы') {
      result = result.filter(task => task.task_status === statusFilter);
    }
    
    // Применение сортировки
    result.sort((a, b) => {
      switch (sortOption) {
        case 'По сроку':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'По приоритету': {
          const priorityOrder = { 'Высокий': 0, 'Средний': 1, 'Низкий': 2 };
          return priorityOrder[a.task_priority] - priorityOrder[b.task_priority];
        }
        case 'По названию':
          return a.task_name.localeCompare(b.task_name);
        default:
          return 0;
      }
    });
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, statusFilter, sortOption]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="500" sx={{ mb: 3 }}>
        Управление задачами
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={handleSearchChange} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <TaskFilters 
              statusFilter={statusFilter}
              sortOption={sortOption}
              onStatusFilterChange={handleStatusFilterChange}
              onSortOptionChange={handleSortOptionChange}
            />
          </Box>
        </Grid>
      </Grid>
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : (
        <TaskTable 
          tasks={filteredTasks} 
          onEdit={handleEditTask} 
          onDelete={handleDeleteTask} 
        />
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskManager;
