import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names safely */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/** Delay helper */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Truncate text to a given length */
export function truncate(text, length = 50) {
    if (!text) return '';
    return text.length > length ? `${text.slice(0, length)}...` : text;
}

/** Get initials from a name */
export function getInitials(name) {
    if (!name) return '';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/** Generate a unique ID */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Capitalize first letter */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Deep clone an object */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/** Debounce utility */
export function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
