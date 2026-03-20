import { cn } from '../../utils/helpers';

export default function InputField({
    label,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    icon: Icon,
    required = false,
    disabled = false,
    className,
    ...props
}) {
    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-slate-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={cn(
                        'w-full rounded-lg bg-white border text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all py-2.5 shadow-sm',
                        Icon ? 'pl-10 pr-4' : 'px-4',
                        error ? 'border-red-300' : 'border-blue-200',
                        disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}
