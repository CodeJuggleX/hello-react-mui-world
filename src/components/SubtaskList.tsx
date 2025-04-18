
import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Avatar, 
  Paper, 
  Typography, 
  Box, 
  Chip 
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TaskStatusChip from './TaskStatusChip';
import { Task } from '../types/types';

interface SubtaskListProps {
  subtasks: Task[];
}

const SubtaskList: React.FC<SubtaskListProps> = ({ subtasks }) => {
  const navigate = useNavigate();

  // Функция для форматирования даты из ISO в дд.мм.гггг
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  if (!subtasks || subtasks.length === 0) {
    return <Typography variant="body2" color="text.secondary">Подзадач нет</Typography>;
  }

  return (
    <Paper variant="outlined" sx={{ mt: 2 }}>
      <List disablePadding>
        {subtasks.map((subtask) => (
          <ListItem 
            key={subtask.id} 
            divider
            sx={{ 
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
              p: 2
            }}
            onClick={() => navigate(`/task/${subtask.id}`)}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Assignment color="primary" />
            </ListItemIcon>
            <ListItemText 
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1" fontWeight={500}>{subtask.task_name}</Typography>
                  <TaskStatusChip status={subtask.task_status} />
                </Box>
              }
              secondary={
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary" 
                    sx={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {subtask.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        src={subtask.employee_info.image} 
                        alt={subtask.employee_info.full_name}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="caption">
                        {subtask.employee_info.full_name}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`Срок: ${formatDate(subtask.deadline)}`} 
                      size="small" 
                      variant="outlined"
                    />
                    <Chip 
                      label={subtask.task_priority} 
                      size="small" 
                      color={
                        subtask.task_priority === 'Высокий' ? 'error' :
                        subtask.task_priority === 'Средний' ? 'warning' : 'success'
                      }
                      variant="outlined"
                    />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SubtaskList;
