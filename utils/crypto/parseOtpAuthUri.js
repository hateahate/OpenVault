export function parseOtpAuthUri(uri) {
    const url = new URL(uri);
    const label = decodeURIComponent(url.pathname.slice(1));
    const secret = url.searchParams.get('secret');
    const period = url.searchParams.get('period') ? parseInt(url.searchParams.get('period')) : 30;
    const digits = url.searchParams.get('digits') ? parseInt(url.searchParams.get('digits')) : 6;

    if (!secret) {
        throw new Error('QR-код не содержит секрет.');
    }

    return { label, secret, period, digits };
}