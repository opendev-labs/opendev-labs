import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// All imports from self-contained local copies inside openstudio/
import StudioApp from './studio/App';
import { AuthProvider as VoidAuthProvider } from './void/contexts/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

/**
 * Root App for openstudio.opendev-labs.com
 * Mounts the OpenStudio AI builder directly at / (root)
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <VoidAuthProvider>
            <Routes>
              <Route
                path="/*"
                element={
                  <div className="w-full h-screen overflow-hidden bg-[#09090b] text-zinc-100">
                    <StudioApp />
                  </div>
                }
              />
            </Routes>
          </VoidAuthProvider>
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#fafafa',
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
