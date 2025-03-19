
import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="outline" 
      size="icon"
      onClick={toggleDarkMode}
      className="relative h-10 w-10 rounded-full bg-secondary/80 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden p-0"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={{ y: isDarkMode ? 30 : 0, opacity: isDarkMode ? 0 : 1 }}
          animate={{ y: isDarkMode ? 30 : 0, opacity: isDarkMode ? 0 : 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="absolute text-amber-300"
        >
          <Sun size={20} className="drop-shadow-md" />
        </motion.div>
        
        <motion.div
          initial={{ y: isDarkMode ? 0 : -30, opacity: isDarkMode ? 1 : 0 }}
          animate={{ y: isDarkMode ? 0 : -30, opacity: isDarkMode ? 1 : 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          className="absolute text-indigo-300"
        >
          <Moon size={20} className="drop-shadow-md" />
        </motion.div>
      </div>
    </Button>
  );
};

export default DarkModeToggle;
