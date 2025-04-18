
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/apiService';
import TasksList from '../components/TasksList';

const TaskManager = () => {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks
  });

  if (isLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography>Loading tasks...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" py={4}>
          <Typography color="error">Error loading tasks</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tasks
      </Typography>
      <TasksList tasks={tasks || []} />
    </Container>
  );
};

export default TaskManager;
