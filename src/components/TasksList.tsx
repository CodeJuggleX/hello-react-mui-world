
import React from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
  Box,
  Typography
} from '@mui/material';
import { Task } from '../types/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface TasksListProps {
  tasks: Task[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Завершена':
      return 'bg-green-500';
    case 'В процессе':
      return 'bg-blue-500';
    default:
      return 'bg-yellow-500';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Высокий':
      return 'bg-red-500';
    case 'Средний':
      return 'bg-orange-500';
    case 'Низкий':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  return (
    <TableContainer component={Paper} className="mt-4">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Deadline</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} hover>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.task_status)}>
                  {task.task_status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.task_priority)}>
                  {task.task_priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar
                    src={task.employee_info.full_path_image}
                    alt={task.employee_info.full_name}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2">
                    {task.employee_info.full_name}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                {format(new Date(task.deadline), 'dd.MM.yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TasksList;
