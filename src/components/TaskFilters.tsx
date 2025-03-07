
import React from 'react';
import { 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { StatusFilter, SortOption } from '../types/types';

interface TaskFiltersProps {
  statusFilter: StatusFilter;
  sortOption: SortOption;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSortOptionChange: (option: SortOption) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  sortOption,
  onStatusFilterChange,
  onSortOptionChange,
}) => {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusFilterChange(event.target.value as StatusFilter);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    onSortOptionChange(event.target.value as SortOption);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="status-select-label">Статус</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={statusFilter}
          label="Статус"
          onChange={handleStatusChange}
          size="small"
        >
          <MenuItem value="Все статусы">Все статусы</MenuItem>
          <MenuItem value="Завершена">Завершена</MenuItem>
          <MenuItem value="В процессе">В процессе</MenuItem>
          <MenuItem value="Ожидает">Ожидает</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel id="sort-select-label">Сортировка</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          label="Сортировка"
          onChange={handleSortChange}
          size="small"
        >
          <MenuItem value="По сроку">По сроку</MenuItem>
          <MenuItem value="По приоритету">По приоритету</MenuItem>
          <MenuItem value="По названию">По названию</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default TaskFilters;
