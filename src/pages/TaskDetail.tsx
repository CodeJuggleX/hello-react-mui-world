import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Button as MuiButton,
  Divider,
  Alert,
  IconButton,
  Avatar,
  CircularProgress,
  Chip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageSquareIcon from '@mui/icons-material/Comment';
import TaskStatusChip from '../components/TaskStatusChip';
import SubtaskList from '../components/SubtaskList';
import Header from '../components/Header';
import TaskCommentDialog from '../components/TaskCommentDialog';
import { Button } from '../components/ui/button';
import { fetchTaskById } from '../services/apiService';
import { Task } from '../types/types';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      try {
        setLoading(true);
        if (taskId) {
          const taskData = await fetchTaskById(taskId);
          if (taskData) {
            setTask(taskData);
            setError(null);
          } else {
            setError('Задача не найдена');
          }
        } else {
          setError('Некорректный ID задачи');
        }
      } catch (err) {
        setError('Ошибка при загрузке задачи');
        console.error('Error loading task:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  const handleDelete = () => {
    alert('Задача успешно удалена');
    navigate('/');
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleEdit = () => {
    alert('Редактирование задачи: ' + task?.task_name);
  };

  const handleSaveComment = (comment: string) => {
    if (task) {
      console.log(`Сохранение комментария для задачи ${task.id}: ${comment}`);
      setTask({
        ...task,
        comment: comment
      });
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Box mt={2}>
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Вернуться к списку
            </Button>
          </Box>
        </Container>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Typography>Задача не найдена</Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
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
              {task.task_name}
            </Typography>
            <Box>
              <IconButton 
                color="primary" 
                onClick={() => setIsCommentDialogOpen(true)} 
                sx={{ mr: 1 }}
                title="Добавить замечание"
              >
                <MessageSquareIcon />
              </IconButton>
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
                <TaskStatusChip status={task.task_status} />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Приоритет
              </Typography>
              <Box mt={1}>
                <Chip 
                  label={task.task_priority} 
                  color={
                    task.task_priority === 'Высокий' ? 'error' :
                    task.task_priority === 'Средний' ? 'warning' : 'success'
                  }
                  sx={{ height: 24, fontSize: '0.75rem' }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Исполнитель
              </Typography>
              <Box display="flex" alignItems="center" mt={1}>
                <Avatar 
                  src={task.employee_info.image} 
                  alt={task.employee_info.full_name}
                  sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {task.employee_info.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {task.employee_info.position.title}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Срок выполнения
              </Typography>
              <Typography variant="body1" mt={1}>
                {formatDate(task.deadline)}
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

            {task.comment && (
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Замечание
                  </Typography>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsCommentDialogOpen(true)}
                  >
                    Редактировать
                  </Button>
                </Box>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 1, 
                    p: 2,
                    backgroundColor: '#f0f7ff',
                    minHeight: 60
                  }}
                >
                  <Typography variant="body1">
                    {task.comment}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {!task.comment && (
              <Grid item xs={12}>
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Замечания к задаче отсутствуют
                  </Typography>
                  <Button 
                    onClick={() => setIsCommentDialogOpen(true)} 
                    variant="outline"
                  >
                    Добавить замечание
                  </Button>
                </Box>
              </Grid>
            )}

            {task.parent_task && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Родительская задача
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    mt: 1, 
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/task/${task.parent_task}`)}
                >
                  <Typography variant="body1" color="primary">
                    ID задачи: {task.parent_task}
                  </Typography>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Подзадачи
              </Typography>
              {task.subtodo && task.subtodo.length > 0 ? (
                <SubtaskList subtasks={task.subtodo} />
              ) : (
                <Paper 
                  variant="outlined" 
                  sx={{ p: 3, backgroundColor: '#fafafa', textAlign: 'center' }}
                >
                  <Typography color="text.secondary">
                    Подзадачи отсутствуют
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>

        <Box display="flex" justifyContent="flex-end">
          <MuiButton 
            variant="outlined" 
            color="primary" 
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Вернуться к списку
          </MuiButton>
        </Box>
      </Container>

      <TaskCommentDialog 
        open={isCommentDialogOpen}
        onOpenChange={setIsCommentDialogOpen}
        initialComment={task?.comment || ''}
        onSave={handleSaveComment}
      />
    </>
  );
};

export default TaskDetail;
