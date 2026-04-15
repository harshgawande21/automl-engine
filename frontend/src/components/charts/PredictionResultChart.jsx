import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const COLORS = ['#CBD5E1', '#CBD5E1', '#CBD5E1', '#4ADE80', '#CBD5E1', '#CBD5E1', '#CBD5E1'];

// Battery-style confidence bar
function ConfidenceBar({ confidence }) {
    const pct = Math.round((confidence || 0) * 100);
    const bars = 10;
    const filled = Math.round((pct / 100) * bars);
    const color = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#FBBF24' : '#F87171';
    const label = pct >= 80 ? 'Very Sure ✅' : pct >= 60 ? 'Fairly Sure 👍' : 'Not Sure ⚠️';
    return (
        <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-slate-600">How sure is AutoML?</p>
            <div className="flex gap-1 items-center">
                {Array.from({ length: bars }).map((_, i) => (
                    <div key={i} className="w-5 h-7 rounded transition-all"
                        style={{ background: i < filled ? color : '#E5E7EB' }} />
                ))}
                <span className="ml-2 text-sm font-bold text-slate-700">{pct}%</span>
            </div>
            <p className="text-sm font-semibold" style={{ color }}>{label}</p>
        </div>
    );
}

// Scale showing where prediction falls among all possible values
function ValueScale({ uniqueValues, predictedValue }) {
    if (!uniqueValues || uniqueValues.length === 0) return null;
    const predStr = String(predictedValue);
    return (
        <div className="bg-white rounded-2xl border border-blue-100 p-5">
            <p className="font-bold text-slate-800 mb-1">📍 Where does "{predStr}" sit in your data?</p>
            <p className="text-xs text-slate-500 mb-4">
                Your data has {uniqueValues.length} possible values for this column. The highlighted one is what AutoML predicted.
            </p>
            <div className="flex flex-wrap gap-2">
                {uniqueValues.map((v, i) => {
                    const isSelected = String(v) === predStr;
                    return (
                        <div key={i} className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                            isSelected
                                ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-200'
                                : 'bg-slate-100 text-slate-500'
                        }`}>
                            {isSelected && '✓ '}{v}
                        </div>
                    );
                })}
            </div>
            {uniqueValues.length > 0 && (
                <p className="text-xs text-slate-500 mt-3">
                    ✅ AutoML picked <strong>"{predStr}"</strong> — this is one of {uniqueValues.length} possible outcomes in your dataset.
                </p>
            )}
        </div>
    );
}

// Probability donut/bar chart
function ProbabilityChart({ probabilities, uniqueValues }) {
    if (!probabilities || probabilities.length < 2) return null;
    const data = probabilities.map((p, i) => ({
        name: uniqueValues?.[i] != null ? String(uniqueValues[i]) : `Option ${i + 1}`,
        value: Math.round(p * 100),
    })).sort((a, b) => b.value - a.value);

    const maxVal = data[0]?.value || 1;

    return (
        <div className="bg-white rounded-2xl border border-blue-100 p-5">
            <p className="font-bold text-slate-800 mb-1">📊 Probability of each outcome</p>
            <p className="text-xs text-slate-500 mb-4">The green bar is what AutoML predicts. Others are less likely alternatives.</p>
            <div className="space-y-3">
                {data.map((item, i) => (
                    <div key={item.name} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-600 w-20 text-right truncate">{item.name}</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
                            <div
                                className="h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700"
                                style={{
                                    width: `${(item.value / maxVal) * 100}%`,
                                    background: i === 0 ? 'linear-gradient(90deg, #4ADE80, #22C55E)' : '#CBD5E1',
                                    minWidth: '40px'
                                }}
                            >
                                <span className="text-xs font-bold text-white">{item.value}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PredictionResultChart({ result, modelType, taskType, currentModel }) {
    if (!result) return null;

    const raw = result?.data || result;
    const prediction = raw?.prediction;
    const originalLabel = raw?.original_label;
    const targetColumn = (raw?.target_column || currentModel?.target_column || 'result').replace(/_/g, ' ');
    const targetUniqueValues = raw?.target_unique_values || [];
    const confidence = raw?.confidence;
    const probabilities = raw?.probabilities;
    const latency = raw?.latency_ms;

    const displayValue = originalLabel != null ? String(originalLabel) : String(prediction ?? '—');
    
    // Convert 0/1 binary predictions to Yes/No for better readability
    const isBinary = targetUniqueValues.length === 2 && 
        targetUniqueValues.every(v => v === '0' || v === '1' || v === 0 || v === 1);
    const friendlyValue = isBinary 
        ? (displayValue === '1' || displayValue === 'True' ? '✅ Yes' : '❌ No')
        : displayValue;
    const friendlyLabel = isBinary
        ? (displayValue === '1' ? 'Yes — this applies' : 'No — this does not apply')
        : displayValue;
    const pct = confidence ? Math.round(confidence * 100) : null;

    const theme = pct >= 80
        ? { bg: 'bg-green-50', border: 'border-green-300', badge: 'bg-green-500' }
        : pct >= 60
        ? { bg: 'bg-blue-50', border: 'border-blue-300', badge: 'bg-blue-500' }
        : { bg: 'bg-yellow-50', border: 'border-yellow-300', badge: 'bg-yellow-500' };

    // Plain English explanation — no HTML tags
    const getExplanation = () => {
        const col = targetColumn;
        const total = targetUniqueValues.length;
        const context = total > 0 ? ` (one of ${total} possible values in your data)` : '';
        if (taskType === 'regression') {
            return `AutoML analyzed your data and estimates the ${col} will be around ${displayValue}. Think of it like a price estimate — based on similar records, this is the most likely value.`;
        }
        if (pct >= 80) return `AutoML is ${pct}% confident the ${col} is "${displayValue}"${context}. Out of every 100 similar cases in your data, about ${pct} of them had this result.`;
        if (pct >= 60) return `AutoML thinks the ${col} is probably "${displayValue}"${context} — ${pct}% confident. Like a weather forecast saying "likely sunny" — it's the best guess but not guaranteed.`;
        return `AutoML predicts "${displayValue}"${context} but the data has mixed signals. Consider checking if the data looks correct.`;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-pink-500 rounded-2xl px-6 py-4 flex items-center justify-between">
                <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">AutoML Prediction</p>
                    <p className="text-white font-bold text-lg capitalize">{targetColumn}</p>
                </div>
                {latency && <span className="text-white/60 text-xs bg-white/10 px-3 py-1 rounded-full">⚡ {latency.toFixed(0)}ms</span>}
            </div>

            {/* Main result */}
            <div className={`rounded-2xl border-2 ${theme.bg} ${theme.border} p-6 space-y-4`}>
                <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${theme.badge} inline-block`}>
                    AutoML Result
                </span>

                {/* Big answer */}
                <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center flex-shrink-0 border-4 border-green-200">
                        <span className="text-2xl font-black text-slate-800 text-center px-1">{friendlyValue}</span>
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Predicted {targetColumn}</p>
                        <p className="text-xl font-black text-slate-800 mt-0.5">{friendlyLabel}</p>
                        {isBinary && (
                            <p className="text-xs text-slate-500 mt-1">
                                {displayValue === '1' ? `✅ "${targetColumn}" = YES for this record` : `❌ "${targetColumn}" = NO for this record`}
                            </p>
                        )}
                        {!isBinary && targetUniqueValues.length > 0 && (
                            <p className="text-xs text-slate-500 mt-1">
                                Value #{targetUniqueValues.indexOf(displayValue) + 1} of {targetUniqueValues.length} possible values
                            </p>
                        )}
                    </div>
                </div>

                {/* Confidence bar */}
                {confidence != null && (
                    <div className="bg-white/80 rounded-xl p-4">
                        <ConfidenceBar confidence={confidence} />
                    </div>
                )}

                {/* Plain English — no HTML tags */}
                <div className="bg-white rounded-xl p-4 border border-white/50">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        📌 {getExplanation()}
                    </p>
                </div>
            </div>

            {/* Value scale — shows where prediction sits */}
            {targetUniqueValues.length > 0 && (
                <ValueScale uniqueValues={targetUniqueValues} predictedValue={displayValue} />
            )}

            {/* Probability chart */}
            {probabilities && probabilities.length > 1 && (
                <ProbabilityChart probabilities={probabilities} uniqueValues={targetUniqueValues} />
            )}

            {/* How AutoML works */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                <p className="font-bold text-slate-700 mb-3 text-sm">🤖 How AutoML reached this answer</p>
                <div className="flex gap-3">
                    {[
                        ['📂', 'Read your data', 'Scanned all rows and columns in your file'],
                        ['🔍', 'Found patterns', `Discovered what leads to each of the ${targetUniqueValues.length || '?'} possible outcomes`],
                        ['🎯', `Predicted "${displayValue}"`, `This pattern appeared most often for records like yours`],
                    ].map(([icon, title, desc]) => (
                        <div key={title} className="flex-1 text-center p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-2xl">{icon}</span>
                            <p className="text-xs font-bold text-slate-800 mt-1">{title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
