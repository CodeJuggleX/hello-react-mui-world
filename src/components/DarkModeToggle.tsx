
import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-xl border border-white/15 backdrop-blur-md shadow-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isDarkMode ? 0.85 : 1, 
          opacity: 1, 
          rotate: isDarkMode ? -20 : 0 
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className={`text-amber-300 ${isDarkMode ? 'opacity-50' : 'opacity-100'}`}
      >
        <Sun size={20} className="drop-shadow-md" />
      </motion.div>
      
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-amber-400/30 h-[22px] w-[40px]"
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: isDarkMode ? 1 : 0.85, 
          opacity: 1, 
          rotate: isDarkMode ? 0 : 20 
        }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        className={`text-indigo-300 ${isDarkMode ? 'opacity-100' : 'opacity-50'}`}
      >
        <Moon size={20} className="drop-shadow-md" />
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
