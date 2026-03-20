import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/helpers';

export default function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
    placeholder = 'Select...',
    error,
    required = false,
    disabled = false,
    className,
}) {
    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <div className="relative">
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={cn(
                        'w-full appearance-none rounded-lg bg-white border text-sm text-slate-700 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                        error ? 'border-red-500' : 'border-slate-300',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                >
                    <option value="" className="text-slate-500">{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
