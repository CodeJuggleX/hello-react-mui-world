
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { Box } from '@mui/material';

interface TaskCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComment?: string;
  onSave: (comment: string) => void;
  taskId?: string;
}

const TaskCommentDialog: React.FC<TaskCommentDialogProps> = ({
  open,
  onOpenChange,
  initialComment = '',
  onSave,
  taskId,
}) => {
  const { toast } = useToast();
  const [commentText, setCommentText] = useState(initialComment);

  const handleSave = () => {
    onSave(commentText);
    toast({
      title: "Замечание сохранено",
      description: "Замечание к задаче успешно сохранено",
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setCommentText(initialComment);
    onOpenChange(false);
  };

  // Сбрасываем текст при открытии диалога
  React.useEffect(() => {
    if (open) {
      setCommentText(initialComment);
    }
  }, [open, initialComment]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            <Box display="flex" alignItems="center">
              <MessageSquare size={20} color="#ea384c" className="mr-2" />
              Замечание к задаче {taskId ? `#${taskId}` : ''}
            </Box>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Введите текст замечания..."
            className="min-h-[100px]"
            style={{ borderColor: "#eaeaea", padding: "12px" }}
          />
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!commentText.trim()}>
            Сохранить замечание
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCommentDialog;
