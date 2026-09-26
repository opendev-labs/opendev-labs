import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Re-use the existing studio app and auth provider from the parent monorepo
// These are path-aliased via vite.config.ts (@studio, @)
import StudioApp from '@studio/App';
import { AuthProvider as VoidAuthProvider } from '@/features/void/contexts/AuthContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

/**
 * Root App for openstudio.opendev-labs.com
 *
 * This is a STANDALONE deployment of the OpenStudio AI builder.
 * It mounts directly at the root `/` instead of `/open-studio`.
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <VoidAuthProvider>
            <Routes>
              {/* Studio app handles its own internal routing (hash-based) */}
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
