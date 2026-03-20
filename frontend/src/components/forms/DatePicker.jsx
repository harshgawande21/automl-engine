import { Calendar } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function DatePicker({ label, name, value, onChange, error, className }) {
    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-slate-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    id={name}
                    name={name}
                    type="date"
                    value={value}
                    onChange={onChange}
                    className={cn(
                        'w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800 border text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all',
                        error ? 'border-red-500' : 'border-slate-700'
                    )}
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
