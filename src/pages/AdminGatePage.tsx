import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, Lock, LogIn, AlertCircle } from 'lucide-react';
import { adminLogin, isAdminAuthenticated } from '../lib/adminAuth';

export const AdminGatePage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animRef = useRef<number | undefined>(undefined);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdminAuthenticated()) {
      navigate('/xk9-admin-control', { replace: true });
    }
  }, [navigate]);

  // Lock after 5 failed attempts
  useEffect(() => {
    if (attempts >= 5) {
      setLocked(true);
      setLockTimer(30);
    }
  }, [attempts]);

  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => {
      setLockTimer(prev => {
        if (prev <= 1) {
          clearInterval(t);
          setLocked(false);
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [locked]);

  // Animated dark background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('mousemove', onMouse);

    const orbs = [
      { x: 0.2, y: 0.3, vx: 0.0001, vy: 0.00008, r: 0.35, phase: 0, ps: 0.005, c: [80, 100, 200] as [number,number,number], a: 0.07 },
      { x: 0.8, y: 0.7, vx: -0.00009, vy: -0.0001, r: 0.30, phase: 2, ps: 0.006, c: [150, 100, 255] as [number,number,number], a: 0.06 },
      { x: 0.5, y: 0.5, vx: 0.00003, vy: 0.00004, r: 0.45, phase: 4, ps: 0.003, c: [60, 80, 180] as [number,number,number], a: 0.04 },
    ];

    const render = () => {
      time += 1;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);

      const mx = mouseRef.current.x, my = mouseRef.current.y;
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        o.vx += (mx - o.x) * 0.000002; o.vy += (my - o.y) * 0.000002;
        o.vx *= 0.999; o.vy *= 0.999;
        o.phase += o.ps;
        const b = 1 + Math.sin(o.phase) * 0.15;
        const cx = o.x * W, cy = o.y * H, r = o.r * Math.min(W, H) * b;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        const [R, G, B] = o.c;
        g.addColorStop(0, `rgba(${R},${G},${B},${(o.a * b).toFixed(3)})`);
        g.addColorStop(0.5, `rgba(${R},${G},${B},${(o.a * b * 0.3).toFixed(3)})`);
        g.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || isLoading) return;
    setError('');
    setIsLoading(true);

    // Simulate auth delay for security feel
    await new Promise(r => setTimeout(r, 900));

    const ok = adminLogin(username, password);
    setIsLoading(false);

    if (ok) {
      navigate('/xk9-admin-control', { replace: true });
    } else {
      setAttempts(prev => prev + 1);
      setError('Invalid credentials. Access denied.');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Live background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Overlay grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glow behind card */}
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 blur-3xl scale-110 pointer-events-none" />

        <div
          className="relative rounded-3xl border border-white/10 p-8 space-y-7"
          style={{ background: 'rgba(8,8,12,0.92)', backdropFilter: 'blur(24px)' }}
        >
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg shadow-indigo-500/30 mx-auto">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Admin Control Gate</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">OpenDev Labs • Restricted Access</p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-400 tracking-wider">CLASSIFIED ENDPOINT</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Admin Username</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter admin username"
                  disabled={locked}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Access Code</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter access code"
                  disabled={locked}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-mono placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {(error || locked) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-300 font-medium">
                    {locked
                      ? `Too many failed attempts. Locked for ${lockTimer}s.`
                      : error}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || locked || !username || !password}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Access Control Center
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-[10px] text-zinc-600 font-medium">
              Session expires after 8 hours • All access is logged
            </p>
            {attempts > 0 && !locked && (
              <p className="text-[10px] text-red-500 mt-1 font-bold">
                {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
