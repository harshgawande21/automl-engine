import { cn } from '../../utils/helpers';

export default function Loader({ size = 'md', text, className }) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <div
                className={cn(
                    'rounded-full border-indigo-500 border-t-transparent animate-spin',
                    sizeClasses[size]
                )}
            />
            {text && <p className="text-sm text-slate-400 animate-pulse">{text}</p>}
        </div>
    );
}

export function FullPageLoader({ text = 'Loading...' }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                <p className="text-slate-300 animate-pulse">{text}</p>
            </div>
        </div>
    );
}
