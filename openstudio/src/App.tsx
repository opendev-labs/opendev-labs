import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// ../  = from openstudio/src/ up to openstudio/
import StudioApp from '../studio/App';
import { OpenStudioAuthGate } from '../components/OpenStudioAuthGate';
import { AuthProvider as VoidAuthProvider } from '../void/contexts/AuthContext';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Root App for openstudio.opendev-labs.com
 * Mounts the OpenStudio AI builder directly at / (root) protected by Sovereign AuthGate
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
                  <OpenStudioAuthGate>
                    <div className="w-full h-screen overflow-hidden bg-[#09090b] text-zinc-100">
                      <StudioApp />
                    </div>
                  </OpenStudioAuthGate>
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
