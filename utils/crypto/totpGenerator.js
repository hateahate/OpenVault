import CryptoJS from 'crypto-js';
import { base32Decode } from './base32';
import { wordArrayToBytes } from './wordArrayHelpers';

export function generateTOTP(secret, step = 30, digits = 6) {
    const currentTime = Math.floor(Date.now() / 1000);
    const counter = Math.floor(currentTime / step);

    const counterBytes = new Uint8Array(8);
    let movingCounter = counter;
    for (let i = 7; i >= 0; i--) {
        counterBytes[i] = movingCounter & 0xff;
        movingCounter >>= 8;
    }

    const key = base32Decode(secret);
    const counterWordArray = CryptoJS.lib.WordArray.create(counterBytes);
    const keyWordArray = CryptoJS.enc.Latin1.parse(key);

    const hmac = CryptoJS.HmacSHA1(counterWordArray, keyWordArray);
    const hmacBytes = wordArrayToBytes(hmac);

    const offset = hmacBytes[hmacBytes.length - 1] & 0xf;
    const binary =
        ((hmacBytes[offset] & 0x7f) << 24) |
        ((hmacBytes[offset + 1] & 0xff) << 16) |
        ((hmacBytes[offset + 2] & 0xff) << 8) |
        (hmacBytes[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, digits);
    return otp.toString().padStart(digits, '0');
}
