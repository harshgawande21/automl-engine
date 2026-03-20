import React from 'react';
import { cn } from '../../utils/helpers';

export default function ConfusionMatrix({ matrix, labels = ['Negative', 'Positive'] }) {
    if (!matrix || matrix.length === 0) return null;
    const maxVal = Math.max(...matrix.flat());

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center">
                <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${labels.length}, 1fr)` }}>
                    {/* Header row */}
                    <div />
                    {labels.map((label) => (
                        <div key={label} className="text-center text-xs font-medium text-indigo-400 px-4 py-2">
                            Pred: {label}
                        </div>
                    ))}

                    {/* Data rows */}
                    {matrix.map((row, i) => (
                        <React.Fragment key={i}>
                            <div className="text-xs font-medium text-slate-400 flex items-center pr-3">
                                True: {labels[i]}
                            </div>
                            {row.map((val, j) => {
                                const intensity = maxVal > 0 ? val / maxVal : 0;
                                const isDiagonal = i === j;
                                return (
                                    <div
                                        key={j}
                                        className={cn(
                                            'flex items-center justify-center rounded-lg text-sm font-bold min-w-[60px] min-h-[60px]',
                                            isDiagonal
                                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                                : 'bg-red-500/10 text-red-300 border border-red-500/20'
                                        )}
                                        style={{ opacity: 0.4 + intensity * 0.6 }}
                                    >
                                        {val}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
