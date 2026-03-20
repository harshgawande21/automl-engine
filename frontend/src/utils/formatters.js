/** Format a number with commas */
export function formatNumber(num) {
    if (num === null || num === undefined) return '—';
    return Number(num).toLocaleString();
}

/** Format percentage */
export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined) return '—';
    return `${(Number(value) * 100).toFixed(decimals)}%`;
}

/** Format date string */
export function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/** Format date and time */
export function formatDateTime(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/** Format file size */
export function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

/** Format duration in milliseconds */
export function formatDuration(ms) {
    if (!ms) return '0ms';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
}

/** Format metric value */
export function formatMetric(value, decimals = 4) {
    if (value === null || value === undefined) return '—';
    return Number(value).toFixed(decimals);
}
