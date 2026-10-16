import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function resolveStorageUrl(url?: string | null, fullUrl?: string | null): string | null {
    if (fullUrl && (fullUrl.startsWith('http://') || fullUrl.startsWith('https://'))) {
        return fullUrl;
    }
    if (!url) {
        return null;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    if (url.startsWith('/storage/')) {
        return url;
    }
    if (url.startsWith('storage/')) {
        return `/${url}`;
    }
    if (url.startsWith('/')) {
        return url;
    }
    return `/storage/${url}`;
}

