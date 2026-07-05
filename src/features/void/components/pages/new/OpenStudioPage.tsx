import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const OpenStudioPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/open-studio', { replace: true });
    }, [navigate]);
    return (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
            Materializing Neural Mesh...
        </div>
    );
};
