
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography,
  Avatar,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TaskStatusChip from './TaskStatusChip';
import { Task } from '../types/types';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewDetails = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  // Функция для форматирования даты из ISO в дд.мм.гггг
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>Название</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Приоритет</TableCell>
            <TableCell>Исполнитель</TableCell>
            <TableCell>Срок</TableCell>
            <TableCell align="center">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: '#f9f9f9' },
                cursor: 'pointer'
              }}
              onClick={() => task.id && handleViewDetails(task.id)}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {task.task_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    maxWidth: 250, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    color: '#666'
                  }}
                >
                  {task.description}
                </Typography>
              </TableCell>
              <TableCell>
                <TaskStatusChip status={task.task_status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{task.task_priority}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    src={task.employee_info.image} 
                    alt={task.employee_info.full_name}
                    sx={{ width: 30, height: 30, mr: 1 }}
                  />
                  <Typography variant="body2">
                    {task.employee_info.full_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{formatDate(task.deadline)}</Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    task.id && handleViewDetails(task.id);
                  }}
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={(e) => {
                    e.stopPropagation();
                    task.id && onDelete(task.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
