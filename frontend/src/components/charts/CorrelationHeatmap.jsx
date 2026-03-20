import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

export default function CorrelationHeatmap({ data, columns, height = 400 }) {
    const [hoveredCell, setHoveredCell] = useState(null);

    if (!data || !columns || columns.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <AlertCircle className="w-12 h-12 text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium">Correlation data not synchronized</p>
            </div>
        );
    }

    const getColor = (value) => {
        const absValue = Math.abs(value);
        if (value > 0.7) return 'rgba(16, 185, 129, 0.9)'; // Strong Positive - Emerald
        if (value < -0.7) return 'rgba(239, 68, 68, 0.9)'; // Strong Negative - Red
        if (absValue > 0.4) return 'rgba(99, 102, 241, 0.6)'; // Moderate - Indigo
        if (absValue > 0.2) return 'rgba(245, 158, 11, 0.4)'; // Weak - Amber
        return 'rgba(241, 245, 249, 1)'; // Neutral
    };

    const insights = useMemo(() => {
        const list = [];
        for (let i = 0; i < columns.length; i++) {
            for (let j = i + 1; j < columns.length; j++) {
                const val = data[columns[i]]?.[columns[j]];
                if (Math.abs(val) > 0.5) {
                    list.push({
                        f1: columns[i],
                        f2: columns[j],
                        val: val,
                        type: val > 0 ? 'positive' : 'negative'
                    });
                }
            }
        }
        return list.sort((a, b) => Math.abs(b.val) - Math.abs(a.val)).slice(0, 4);
    }, [data, columns]);

    const cellSize = Math.min(60, Math.max(40, (height - 120) / columns.length));
    const labelSize = 80;
    const chartSize = cellSize * columns.length;

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 overflow-hidden">
                {/* Matrix Panel */}
                <div className="xl:col-span-3 overflow-auto custom-scrollbar relative">
                    <div style={{ width: chartSize + labelSize + 40, height: chartSize + labelSize + 40, padding: 20 }}>
                        {/* Top Labels */}
                        <div className="flex sticky top-0 bg-white/80 backdrop-blur-sm z-10" style={{ marginLeft: labelSize }}>
                            {columns.map((col, i) => (
                                <div
                                    key={i}
                                    className="text-[10px] font-bold text-slate-500 flex items-center justify-center"
                                    style={{
                                        width: cellSize,
                                        height: labelSize,
                                        transform: 'rotate(-45deg)',
                                        transformOrigin: 'bottom left',
                                        whiteSpace: 'nowrap',
                                        paddingLeft: 10
                                    }}
                                >
                                    {col}
                                </div>
                            ))}
                        </div>

                        {/* Matrix Grid */}
                        <div className="flex">
                            {/* Left Labels */}
                            <div className="flex flex-col sticky left-0 bg-white/80 backdrop-blur-sm z-10">
                                {columns.map((col, i) => (
                                    <div
                                        key={i}
                                        className="text-[10px] font-bold text-slate-500 flex items-center justify-end pr-4"
                                        style={{ height: cellSize, width: labelSize }}
                                    >
                                        <span className="truncate">{col}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Cells */}
                            <div className="relative">
                                {columns.map((col1, i) => (
                                    <div key={i} className="flex">
                                        {columns.map((col2, j) => {
                                            const val = data[col1]?.[col2];
                                            const isDiagonal = i === j;
                                            const isHovered = hoveredCell?.i === i || hoveredCell?.j === j;
                                            
                                            return (
                                                <div
                                                    key={j}
                                                    onMouseEnter={() => setHoveredCell({ i, j })}
                                                    onMouseLeave={() => setHoveredCell(null)}
                                                    className={`relative border border-white flex items-center justify-center text-[10px] font-bold transition-all duration-200
                                                        ${isDiagonal ? 'bg-slate-100 text-slate-400' : ''}
                                                        ${isHovered ? 'ring-2 ring-indigo-500 z-10 scale-105 shadow-lg' : ''}
                                                    `}
                                                    style={{
                                                        width: cellSize,
                                                        height: cellSize,
                                                        backgroundColor: isDiagonal ? undefined : getColor(val),
                                                        color: !isDiagonal && Math.abs(val) > 0.4 ? 'white' : 'inherit'
                                                    }}
                                                    title={`${col1} ↔ ${col2}: ${(val || 0).toFixed(3)}`}
                                                >
                                                    {isDiagonal ? '-' : (val || 0).toFixed(2)}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Insights Side Panel */}
                <div className="space-y-4 pr-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                        Strategic Links
                    </h4>
                    <div className="space-y-3">
                        {insights.length > 0 ? insights.map((insight, idx) => (
                            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[60px]">{insight.f1}</span>
                                    <div className={`px-2 py-0.5 rounded text-[9px] font-black ${insight.type === 'positive' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {Math.abs(insight.val * 100).toFixed(0)}% Link
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[60px]">{insight.f2}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                    {insight.type === 'positive' 
                                        ? 'Directly proportional relationship detected.' 
                                        : 'Inversesly related. One drops as other grows.'}
                                </p>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <Info className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-[10px] text-slate-400">No strong correlations in selected subset.</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-[9px] text-indigo-700 leading-relaxed font-medium">
                            <span className="font-bold underline">Tip:</span> High correlations (&gt;0.8) may indicate redundant features. Consider dropping one to improve model efficiency.
                        </p>
                    </div>
                </div>
            </div>

            {/* Scale Legend */}
            <div className="mt-6 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-500 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500 opacity-90"></div>
                    <span>Strong Positive</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500 opacity-90"></div>
                    <span>Strong Negative</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-indigo-400 opacity-60"></div>
                    <span>Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-400 opacity-40"></div>
                    <span>Weak Interaction</span>
                </div>
            </div>
        </div>
    );
}
