/** Validate email address */
export function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/** Validate password strength */
export function isStrongPassword(password) {
    return password && password.length >= 8;
}

/** Validate required field */
export function isRequired(value) {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
}

/** Validate file type */
export function isValidFileType(file, allowedTypes = ['csv', 'xlsx', 'json']) {
    if (!file) return false;
    const ext = file.name.split('.').pop().toLowerCase();
    return allowedTypes.includes(ext);
}

/** Validate file size (default: 50MB) */
export function isValidFileSize(file, maxSizeMB = 50) {
    if (!file) return false;
    return file.size <= maxSizeMB * 1024 * 1024;
}
