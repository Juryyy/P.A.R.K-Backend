export function sanitize(text: string): string {
    const normalized = text.normalize('NFKD')
        .replace(/[řŘ]/g, 'r')
        .replace(/[žŽ]/g, 'z')
        .replace(/[šŠ]/g, 's')
        .replace(/[čČ]/g, 'c')
        .replace(/[ěĚ]/g, 'e')
        .replace(/[ňŇ]/g, 'n')
        .replace(/[ťŤ]/g, 't')
        .replace(/[ďĎ]/g, 'd')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase();

    return normalized;
}