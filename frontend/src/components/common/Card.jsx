import { cn } from '../../utils/helpers';

export default function Card({ children, className, hover = false, glow = false, ...props }) {
    return (
        <div
            className={cn(
                'rounded-xl bg-white/80 border border-blue-100 backdrop-blur-sm p-6 shadow-sm',
                hover && 'hover:border-pink-300 hover:shadow-lg hover:shadow-pink-200/50 transition-all duration-300',
                glow && 'shadow-lg shadow-blue-300/20 border-pink-200',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className }) {
    return (
        <div className={cn('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
}

export function CardTitle({ children, className }) {
    return <h3 className={cn('text-lg font-semibold text-slate-800', className)}>{children}</h3>;
}

export function CardContent({ children, className }) {
    return <div className={cn('', className)}>{children}</div>;
}
