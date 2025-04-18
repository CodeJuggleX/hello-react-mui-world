
import React from 'react';
import { Container, Typography } from '@mui/material';
import Tasks from '../components/Tasks';
import Header from '../components/Header';

const TaskManager: React.FC = () => {
  return (
    <>
      <Header />
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" component="h1" className="mb-6">
          Управление задачами
        </Typography>
        <Tasks />
      </Container>
    </>
  );
};

export default TaskManager;
