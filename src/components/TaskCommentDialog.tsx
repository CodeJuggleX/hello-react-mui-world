
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface TaskCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialComment?: string;
  onSave: (comment: string) => void;
}

const TaskCommentDialog: React.FC<TaskCommentDialogProps> = ({
  open,
  onOpenChange,
  initialComment = '',
  onSave,
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
          <DialogTitle>Замечание к задаче</DialogTitle>
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
