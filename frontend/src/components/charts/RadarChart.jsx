import React from 'react';

export default function RadarChart({ data, title, height = 400 }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    const angleStep = (2 * Math.PI) / data.length;
    const levels = 5;

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Generate points for the polygon
    const generatePolygonPoints = (values, maxRadius) => {
        return values.map((value, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const r = (value / 100) * maxRadius;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            return { x, y };
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="overflow-x-auto">
                <svg width={centerX * 2} height={centerY * 2}>
                    {/* Background circles */}
                    {[...Array(levels)].map((_, i) => {
                        const levelRadius = (radius / levels) * (i + 1);
                        return (
                            <circle
                                key={i}
                                cx={centerX}
                                cy={centerY}
                                r={levelRadius}
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Grid lines */}
                    {data.map((_, index) => {
                        const angle = index * angleStep - Math.PI / 2;
                        const x = centerX + radius * Math.cos(angle);
                        const y = centerY + radius * Math.sin(angle);
                        return (
                            <line
                                key={index}
                                x1={centerX}
                                y1={centerY}
                                x2={x}
                                y2={y}
                                stroke="#E5E7EB"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Data polygons */}
                    {Object.keys(data[0]).filter(key => key !== 'label').map((key, datasetIndex) => {
                        const values = data.map(item => item[key]);
                        const points = generatePolygonPoints(values, radius);
                        const pointString = points.map(p => `${p.x},${p.y}`).join(' ');
                        
                        return (
                            <g key={key}>
                                <polygon
                                    points={pointString}
                                    fill={colors[datasetIndex % colors.length]}
                                    fillOpacity={0.3}
                                    stroke={colors[datasetIndex % colors.length]}
                                    strokeWidth="2"
                                />
                                {/* Data points */}
                                {points.map((point, index) => (
                                    <circle
                                        key={index}
                                        cx={point.x}
                                        cy={point.y}
                                        r="3"
                                        fill={colors[datasetIndex % colors.length]}
                                    />
                                ))}
                            </g>
                        );
                    })}

                    {/* Labels */}
                    {data.map((item, index) => {
                        const angle = index * angleStep - Math.PI / 2;
                        const labelRadius = radius + 20;
                        const x = centerX + labelRadius * Math.cos(angle);
                        const y = centerY + labelRadius * Math.sin(angle);
                        
                        return (
                            <text
                                key={index}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-medium fill-gray-700"
                            >
                                {item.label}
                            </text>
                        );
                    })}

                    {/* Center point */}
                    <circle
                        cx={centerX}
                        cy={centerY}
                        r="2"
                        fill="#374151"
                    />
                </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 flex justify-center space-x-4">
                {Object.keys(data[0]).filter(key => key !== 'label').map((key, index) => (
                    <div key={key} className="flex items-center space-x-2">
                        <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: colors[index % colors.length] }}
                        ></div>
                        <span className="text-xs text-gray-700">{key}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
