import React, { createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SuperAgentSidePanel } from '../components/agents/SuperAgentSidePanel';

interface AISupportContextType {
  isOpen: boolean;
  isAIEnabled: boolean;
  openSupport: () => void;
  closeSupport: () => void;
  toggleSupport: () => void;
  setAIEnabled: (enabled: boolean) => void;
}

const AISupportContext = createContext<AISupportContextType | undefined>(undefined);

export const AISupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIEnabled, setIsAIEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('opendev_ai_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  let isExcludedPage = false;
  try {
    const location = useLocation();
    isExcludedPage = location.pathname === '/auth' || location.pathname.startsWith('/open-studio');
  } catch (e) {
    isExcludedPage = typeof window !== 'undefined' && (window.location.pathname === '/auth' || window.location.pathname.startsWith('/open-studio'));
  }

  const setAIEnabled = (enabled: boolean) => {
    setIsAIEnabledState(enabled);
    localStorage.setItem('opendev_ai_enabled', String(enabled));
    if (!enabled) {
      setIsOpen(false);
    }
  };

  const openSupport = () => {
    if (isAIEnabled && !isExcludedPage) {
      setIsOpen(true);
    }
  };

  const closeSupport = () => setIsOpen(false);

  const toggleSupport = () => {
    if (isAIEnabled && !isExcludedPage) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <AISupportContext.Provider
      value={{
        isOpen,
        isAIEnabled,
        openSupport,
        closeSupport,
        toggleSupport,
        setAIEnabled
      }}
    >
      {children}

      {/* Global 24/7 AI Support Floating Icon Widget (Bottom Right on All Pages EXCEPT Auth Page & Studio) */}
      {isAIEnabled && !isOpen && !isExcludedPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={openSupport}
            className="group relative flex items-center justify-center p-1 bg-transparent border-none outline-none hover:scale-110 active:scale-95 transition-transform duration-300 cursor-pointer overflow-hidden rounded-2xl"
            title="24/7 AI Support Chat"
            aria-label="Open 24/7 AI Support Chat"
          >
            <motion.img
              src="/logo-icon.webp"
              alt="OpenDev AI Support"
              className="h-12 sm:h-14 w-auto object-contain"
              animate={{
                scale: [1, 1.12, 1],
                filter: [
                  'brightness(1) drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                  'brightness(1.4) drop-shadow(0 0 20px rgba(168,85,247,0.95)) contrast(1.15)',
                  'brightness(1) drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                ]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 3.8,
                ease: 'easeInOut'
              }}
            />

            {/* Diagonal Light Beam Shine Sweep Every 5 Seconds */}
            <motion.div
              className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/70 to-transparent -skew-x-12"
              initial={{ x: '-150%' }}
              animate={{ x: ['-150%', '150%'] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 3.8,
                ease: 'easeInOut'
              }}
            />
          </button>
        </motion.div>
      )}

      {/* Global Super Agent AI Panel */}
      {isAIEnabled && !isExcludedPage && <SuperAgentSidePanel open={isOpen} onClose={closeSupport} />}
    </AISupportContext.Provider>
  );
};

export const useAISupport = () => {
  const context = useContext(AISupportContext);
  if (!context) {
    throw new Error('useAISupport must be used within an AISupportProvider');
  }
  return context;
};
