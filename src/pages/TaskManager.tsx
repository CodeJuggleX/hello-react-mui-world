
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import TaskFilters from '../components/TaskFilters';
import TaskTable from '../components/TaskTable';
import { tasks as mockTasks } from '../data/mockTasks';
import { Task, StatusFilter, SortOption } from '../types/types';

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Все статусы');
  const [sortOption, setSortOption] = useState<SortOption>('По сроку');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

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
    // In a real app, this would open a modal to edit the task
    setSnackbar({
      open: true,
      message: `Редактирование задачи: ${task.title}`,
      severity: 'success'
    });
  };

  const handleDeleteTask = (taskId: string) => {
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

  // Filter and sort tasks when dependencies change
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'Все статусы') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'По сроку':
          return new Date(a.dueDate.split('.').reverse().join('-')).getTime() - 
                 new Date(b.dueDate.split('.').reverse().join('-')).getTime();
        case 'По приоритету': {
          const priorityOrder = { 'Высокий': 0, 'Средний': 1, 'Низкий': 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'По названию':
          return a.title.localeCompare(b.title);
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
      
      <TaskTable 
        tasks={filteredTasks} 
        onEdit={handleEditTask} 
        onDelete={handleDeleteTask} 
      />
      
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
