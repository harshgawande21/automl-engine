import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../utils/helpers';

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const styles = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    error: 'border-red-500/30 bg-red-500/10 text-red-400',
    info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
    const Icon = icons[type];

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm',
                styles[type]
            )}
        >
            <Icon size={18} className="flex-shrink-0" />
            <p className="text-sm font-medium flex-1">{message}</p>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors">
                <X size={14} />
            </button>
        </motion.div>
    );
}

export function ToastContainer({ toasts, onRemove }) {
    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 w-80">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
