
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

  // Format date from ISO to dd.mm.yyyy
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'transparent' }}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ 
            backgroundColor: 'rgba(30, 30, 35, 0.7)', 
            '&:hover': { backgroundColor: 'rgba(30, 30, 35, 0.7)' } // Force the same bg on hover
          }}>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Название</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Описание</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Статус</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Приоритет</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Исполнитель</TableCell>
            <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Срок</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => handleViewDetails(task.id)}
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
                    color: 'rgba(255, 255, 255, 0.7)'
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
                    handleViewDetails(task.id);
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
                    onDelete(task.id);
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
