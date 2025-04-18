
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '../services/apiService';
import { Task } from '../types/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Tasks = () => {
  const { toast } = useToast();
  
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    onError: () => {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить задачи",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Задачи не найдены
      </div>
    );
  }

  const getStatusColor = (status: Task['task_status']) => {
    switch (status) {
      case 'Завершена':
        return 'bg-green-500';
      case 'В процессе':
        return 'bg-blue-500';
      case 'Ожидает':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: Task['task_priority']) => {
    switch (priority) {
      case 'Высокий':
        return 'bg-red-500';
      case 'Средний':
        return 'bg-yellow-500';
      case 'Низкий':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Приоритет</TableHead>
            <TableHead>Исполнитель</TableHead>
            <TableHead>Срок</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.task_name}</TableCell>
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
                <div className="flex items-center gap-2">
                  <img
                    src={task.employee_info.image}
                    alt={task.employee_info.full_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{task.employee_info.full_name}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(task.deadline).toLocaleDateString('ru-RU')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Tasks;
