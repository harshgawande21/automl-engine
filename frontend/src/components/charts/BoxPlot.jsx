import React from 'react';

export default function BoxPlot({ data, title, height = 300 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const chartWidth = 600;
    const chartHeight = height - 60;
    const leftMargin = 60;
    const bottomMargin = 40;
    const boxWidth = 40;
    const spacing = (chartWidth - boxWidth) / (data.length + 1);

    // Calculate overall min and max for scaling
    const allValues = data.flatMap(d => [d.min, d.q1, d.median, d.q3, d.max]);
    const globalMin = Math.min(...allValues);
    const globalMax = Math.max(...allValues);
    const range = globalMax - globalMin;

    const scaleValue = (value) => {
        return chartHeight - ((value - globalMin) / range) * chartHeight;
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <svg width={chartWidth + leftMargin} height={height + bottomMargin}>
                    {/* Y-axis */}
                    <line x1={leftMargin} y1={10} x2={leftMargin} y2={chartHeight} stroke="#E5E7EB" strokeWidth="1"/>
                    
                    {/* X-axis */}
                    <line x1={leftMargin} y1={chartHeight} x2={chartWidth + leftMargin} y2={chartHeight} stroke="#E5E7EB" strokeWidth="1"/>
                    
                    {/* Y-axis labels and grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
                        const value = globalMin + (range * ratio);
                        const y = scaleValue(value);
                        return (
                            <g key={ratio}>
                                <text x={leftMargin - 10} y={y + 5} textAnchor="end" className="text-xs fill-gray-600">
                                    {value.toFixed(1)}
                                </text>
                                {ratio > 0 && (
                                    <line x1={leftMargin} y1={y} x2={chartWidth + leftMargin} y2={y} 
                                          stroke="#F3F4F6" strokeWidth="1" strokeDasharray="2,2"/>
                                )}
                            </g>
                        );
                    })}
                    
                    {/* Box plots */}
                    {data.map((item, index) => {
                        const x = leftMargin + spacing * (index + 1);
                        const q1Y = scaleValue(item.q1);
                        const medianY = scaleValue(item.median);
                        const q3Y = scaleValue(item.q3);
                        const minY = scaleValue(item.min);
                        const maxY = scaleValue(item.max);
                        
                        return (
                            <g key={index}>
                                {/* Whiskers */}
                                <line x1={x + boxWidth/2} y1={q1Y} x2={x + boxWidth/2} y2={minY} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                <line x1={x + boxWidth/2} y1={q3Y} x2={x + boxWidth/2} y2={maxY} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                <line x1={x + boxWidth/4} y1={minY} x2={x + 3*boxWidth/4} y2={minY} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                <line x1={x + boxWidth/4} y1={maxY} x2={x + 3*boxWidth/4} y2={maxY} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                
                                {/* Box */}
                                <rect
                                    x={x}
                                    y={q3Y}
                                    width={boxWidth}
                                    height={q1Y - q3Y}
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                />
                                
                                {/* Median line */}
                                <line x1={x} y1={medianY} x2={x + boxWidth} y1={medianY} 
                                      stroke="#1E40AF" strokeWidth="2"/>
                                
                                {/* X-axis label */}
                                <text
                                    x={x + boxWidth/2}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-gray-600"
                                >
                                    {item.name}
                                </text>
                                
                                {/* Statistics labels */}
                                <text
                                    x={x + boxWidth + 5}
                                    y={medianY + 3}
                                    className="text-xs font-medium fill-gray-700"
                                >
                                    {item.median.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
