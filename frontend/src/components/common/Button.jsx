import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/helpers';

const variants = {
    primary: 'bg-gradient-to-r from-blue-400 to-pink-400 hover:from-blue-500 hover:to-pink-500 text-white shadow-lg shadow-blue-400/25',
    secondary: 'bg-gradient-to-r from-yellow-300 to-green-400 hover:from-yellow-400 hover:to-green-500 text-white shadow-lg shadow-yellow-300/25',
    outline: 'border border-blue-300 hover:border-pink-400 text-blue-600 hover:text-pink-600 hover:bg-blue-50',
    danger: 'bg-red-100 hover:bg-red-200 text-red-600 border border-red-300',
    ghost: 'hover:bg-blue-50 text-blue-600 hover:text-pink-600',
    success: 'bg-green-100 hover:bg-green-200 text-green-600 border border-green-300',
};

const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    icon: Icon,
    className,
    ...props
}) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : Icon ? (
                <Icon size={16} className="flex-shrink-0" />
            ) : null}
            {children}
        </button>
    );
}
