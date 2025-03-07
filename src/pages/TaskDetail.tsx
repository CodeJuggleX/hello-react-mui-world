
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskStatusChip from '../components/TaskStatusChip';
import { tasks as mockTasks } from '../data/mockTasks';
import { Task } from '../types/types';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    const foundTask = mockTasks.find(t => t.id === taskId);
    if (foundTask) {
      setTask(foundTask);
    } else {
      setError('Задача не найдена');
    }
  }, [taskId]);

  const handleDelete = () => {
    // В реальном приложении здесь был бы API запрос на удаление
    alert('Задача успешно удалена');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    // В реальном приложении здесь был бы переход на страницу редактирования
    alert('Редактирование задачи: ' + task?.title);
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Вернуться к списку
          </Button>
        </Box>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton 
          color="primary" 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="500">
          Детали задачи
        </Typography>
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h5" component="h2" fontWeight="500">
            {task.title}
          </Typography>
          <Box>
            <IconButton 
              color="primary" 
              onClick={handleEdit}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              color="error" 
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Статус
            </Typography>
            <Box mt={1}>
              <TaskStatusChip status={task.status} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Приоритет
            </Typography>
            <Box mt={1}>
              <Chip 
                label={task.priority} 
                color={
                  task.priority === 'Высокий' ? 'error' :
                  task.priority === 'Средний' ? 'warning' : 'success'
                }
                sx={{ height: 24, fontSize: '0.75rem' }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Исполнитель
            </Typography>
            <Typography variant="body1" mt={1}>
              {task.assignee}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Срок выполнения
            </Typography>
            <Typography variant="body1" mt={1}>
              {task.dueDate}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Описание
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                mt: 1, 
                p: 2,
                backgroundColor: '#fafafa',
                minHeight: 100
              }}
            >
              <Typography variant="body1">
                {task.description}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
        >
          Вернуться к списку
        </Button>
      </Box>
    </Container>
  );
};

export default TaskDetail;
