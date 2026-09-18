import React from 'react';
import StudioApp from '../features/studio/App';
import { AuthProvider as VoidAuthProvider } from '../features/void/contexts/AuthContext';

export const OpenStudioPage: React.FC = () => {
  return (
    <VoidAuthProvider>
      <div className="w-full h-screen overflow-hidden bg-background text-foreground">
        <StudioApp />
      </div>
    </VoidAuthProvider>
  );
};

export default OpenStudioPage;
