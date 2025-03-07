
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TaskStatusChip from './TaskStatusChip';
import { Task } from '../types/types';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
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
                '&:hover': { backgroundColor: '#f9f9f9' }
              }}
            >
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {task.title}
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
                <TaskStatusChip status={task.status} />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{task.priority}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{task.assignee}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{task.dueDate}</Typography>
              </TableCell>
              <TableCell align="center">
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={() => onEdit(task)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDelete(task.id)}
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
