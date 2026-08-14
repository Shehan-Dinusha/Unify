import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import { CheckCircle2, AlertTriangle, X, Info } from 'lucide-react';

// ─── Toast Context ──────────────────────────────────────────────────────────

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ─── Single Toast ───────────────────────────────────────────────────────────

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: {
    bg: 'bg-state-success/10',
    border: 'border-state-success/30',
    icon: 'text-state-success',
    bar: 'bg-state-success',
  },
  error: {
    bg: 'bg-state-error/10',
    border: 'border-state-error/30',
    icon: 'text-state-error',
    bar: 'bg-state-error',
  },
  warning: {
    bg: 'bg-state-warning/10',
    border: 'border-state-warning/30',
    icon: 'text-state-warning',
    bar: 'bg-state-warning',
  },
  info: {
    bg: 'bg-primary-blue/10',
    border: 'border-primary-blue/30',
    icon: 'text-primary-blue',
    bar: 'bg-primary-blue',
  },
};

const Toast = ({ id, type = 'info', title, message, duration = 4000, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const colors = COLORS[type] || COLORS.info;
  const Icon = ICONS[type] || Info;

  const remainingRef = useRef(duration);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(null);

  const startTimer = useCallback((ms) => {
    clearTimeout(timerRef.current);
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(id), 300);
    }, ms);
  }, [id, onRemove]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    startTimer(duration);
    return () => clearTimeout(timerRef.current);
  }, [id, duration, startTimer]);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pausedAtRef.current !== null) {
      const pauseDuration = Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    startTimer(remainingRef.current);
    setIsPaused(false);
  };

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  };

  return (
    <div
      className={`
        w-full max-w-sm rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${colors.bg} ${colors.border}
        ${isVisible && !isExiting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-4 flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${colors.icon}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          {title && <p className="text-body-small-bold text-text-primary font-inter">{title}</p>}
          {message && <p className="text-body-extra-small text-text-secondary font-inter mt-0.5 leading-relaxed">{message}</p>}
        </div>
        <button onClick={handleClose} className="shrink-0 p-1 text-text-secondary hover:text-text-primary transition-colors">
          <X size={14} />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-white/5">
        <div
          className={`h-full ${colors.bar} transition-all ease-linear`}
          style={{
            animation: `shrink ${duration}ms linear forwards`,
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        />
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// ─── Toast Provider ─────────────────────────────────────────────────────────

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const toast = {
    success: (title, message) => addToast({ type: 'success', title, message }),
    error: (title, message) => addToast({ type: 'error', title, message }),
    warning: (title, message) => addToast({ type: 'warning', title, message }),
    info: (title, message) => addToast({ type: 'info', title, message }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container — fixed to top-right */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-auto">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
