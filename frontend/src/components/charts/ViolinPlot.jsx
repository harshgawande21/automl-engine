import React from 'react';

export default function ViolinPlot({ data, title, height = 300 }) {
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
    const violinWidth = 60;
    const spacing = (chartWidth - violinWidth) / (data.length + 1);

    // Calculate overall min and max for scaling
    const allValues = data.flatMap(d => [d.min, d.max]);
    const globalMin = Math.min(...allValues);
    const globalMax = Math.max(...allValues);
    const range = globalMax - globalMin;

    const scaleValue = (value) => {
        return chartHeight - ((value - globalMin) / range) * chartHeight;
    };

    // Generate violin shape (simplified - using normal distribution approximation)
    const generateViolinPath = (mean, std, height) => {
        const points = [];
        const steps = 20;
        
        for (let i = 0; i <= steps; i++) {
            const y = (i / steps) * height;
            const normalizedY = (y - height/2) / (height/4); // Normalize around mean
            const probability = Math.exp(-0.5 * normalizedY * normalizedY); // Normal distribution
            const width = probability * (violinWidth / 2);
            
            points.push(`${width},${y}`);
        }
        
        for (let i = steps; i >= 0; i--) {
            const y = (i / steps) * height;
            const normalizedY = (y - height/2) / (height/4);
            const probability = Math.exp(-0.5 * normalizedY * normalizedY);
            const width = probability * (violinWidth / 2);
            
            points.push(`-${width},${y}`);
        }
        
        return `M ${points.join(' L ')} Z`;
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
                    
                    {/* Violin plots */}
                    {data.map((item, index) => {
                        const x = leftMargin + spacing * (index + 1);
                        const meanY = scaleValue(item.mean);
                        const stdY = (item.std / range) * chartHeight;
                        
                        return (
                            <g key={index}>
                                {/* Violin shape */}
                                <path
                                    d={generateViolinPath(meanY, stdY, chartHeight)}
                                    fill="#3B82F6"
                                    fillOpacity={0.3}
                                    stroke="#3B82F6"
                                    strokeWidth="2"
                                    transform={`translate(${x + violinWidth/2}, 0)`}
                                />
                                
                                {/* Mean line */}
                                <line x1={x} y1={meanY} x2={x + violinWidth} y1={meanY} 
                                      stroke="#1E40AF" strokeWidth="2"/>
                                
                                {/* Quartile lines */}
                                <line x1={x + violinWidth/4} y1={scaleValue(item.q1)} x2={x + 3*violinWidth/4} y1={scaleValue(item.q1)} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                <line x1={x + violinWidth/4} y1={scaleValue(item.q3)} x2={x + 3*violinWidth/4} y1={scaleValue(item.q3)} 
                                      stroke="#6B7280" strokeWidth="1"/>
                                
                                {/* X-axis label */}
                                <text
                                    x={x + violinWidth/2}
                                    y={chartHeight + 20}
                                    textAnchor="middle"
                                    className="text-xs fill-gray-600"
                                >
                                    {item.name}
                                </text>
                                
                                {/* Statistics labels */}
                                <text
                                    x={x + violinWidth + 5}
                                    y={meanY + 3}
                                    className="text-xs font-medium fill-gray-700"
                                >
                                    μ={item.mean.toFixed(1)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
