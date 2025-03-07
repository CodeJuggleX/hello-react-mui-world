
import React from 'react';
import { Chip } from '@mui/material';

interface TaskStatusChipProps {
  status: 'Завершена' | 'В процессе' | 'Ожидает';
}

const TaskStatusChip: React.FC<TaskStatusChipProps> = ({ status }) => {
  const getChipProps = () => {
    switch (status) {
      case 'Завершена':
        return { 
          sx: { backgroundColor: '#2e7d32', color: 'white' },
          label: 'Завершена'
        };
      case 'В процессе':
        return { 
          sx: { backgroundColor: '#0288d1', color: 'white' },
          label: 'В процессе'
        };
      case 'Ожидает':
        return { 
          sx: { backgroundColor: '#ed6c02', color: 'white' },
          label: 'Ожидает'
        };
      default:
        return { 
          sx: { backgroundColor: 'grey' },
          label: status
        };
    }
  };

  const chipProps = getChipProps();
  
  return (
    <Chip 
      sx={{
        ...chipProps.sx,
        borderRadius: '4px',
        fontSize: '0.75rem',
        height: '24px'
      }} 
      label={chipProps.label} 
    />
  );
};

export default TaskStatusChip;
