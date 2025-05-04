import CryptoJS from 'crypto-js';

export function encrypt(text, password) {
    const key = CryptoJS.enc.Utf8.parse(password.padEnd(32, ' '));
    const iv = CryptoJS.enc.Utf8.parse('0000000000000000');
    return CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
}

export function decrypt(cipher, password) {
    try {
        const key = CryptoJS.enc.Utf8.parse(password.padEnd(32, ' '));
        const iv = CryptoJS.enc.Utf8.parse('0000000000000000');
        const bytes = CryptoJS.AES.decrypt(cipher, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
        return null;
    }
}