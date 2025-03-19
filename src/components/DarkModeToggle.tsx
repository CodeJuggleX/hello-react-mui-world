
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: DarkModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isDarkMode ? -20 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-yellow-400"
      >
        <Sun size={18} className={`${isDarkMode ? 'opacity-50' : 'opacity-100'}`} />
      </motion.div>
      
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleDarkMode}
        className="data-[state=checked]:bg-indigo-600"
      />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: isDarkMode ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="text-indigo-300"
      >
        <Moon size={18} className={`${isDarkMode ? 'opacity-100' : 'opacity-50'}`} />
      </motion.div>
    </div>
  );
};

export default DarkModeToggle;
