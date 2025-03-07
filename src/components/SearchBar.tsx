
import React from 'react';
import { 
  Paper, 
  InputBase,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        border: '1px solid #e0e0e0',
        boxShadow: 'none',
      }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Box sx={{ color: 'action.active', ml: 1, display: 'flex' }}>
        <SearchIcon />
      </Box>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Поиск задач..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        inputProps={{ 'aria-label': 'search tasks' }}
      />
    </Paper>
  );
};

export default SearchBar;
