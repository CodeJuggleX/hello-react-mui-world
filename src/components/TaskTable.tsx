
import React, { useState } from 'react';
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
import MessageSquareIcon from '@mui/icons-material/Comment';
import TaskStatusChip from './TaskStatusChip';
import { Task } from '../types/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleViewDetails = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  // Format date from ISO to dd.mm.yyyy
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  };

  const handleOpenCommentDialog = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setSelectedTaskId(taskId);
    // Найти текущий комментарий задачи, если есть
    const task = tasks.find(t => t.id === taskId);
    setCommentText(task?.comment || '');
    setIsCommentDialogOpen(true);
  };

  const handleCloseCommentDialog = () => {
    setIsCommentDialogOpen(false);
    setSelectedTaskId(null);
    setCommentText('');
  };

  const handleSaveComment = () => {
    if (selectedTaskId) {
      // В реальном приложении здесь был бы API-запрос для сохранения комментария
      console.log(`Сохранение комментария для задачи ${selectedTaskId}: ${commentText}`);
      
      toast({
        title: "Замечание добавлено",
        description: "Замечание к задаче успешно сохранено",
      });
      
      handleCloseCommentDialog();
    }
  };

  return (
    <>
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
                      handleViewDetails(task.id);
                    }}
                    title="Просмотр"
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCommentDialog(e, task.id);
                    }}
                    title="Добавить замечание"
                  >
                    <MessageSquareIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                    }}
                    title="Редактировать"
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
                    title="Удалить"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог для добавления замечания */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить замечание к задаче</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Введите текст замечания..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="outline" 
              onClick={handleCloseCommentDialog}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSaveComment}
              disabled={!commentText.trim()}
            >
              Сохранить замечание
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskTable;
