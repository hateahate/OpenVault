export function base32Decode(input) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let output = '';

    input = input.replace(/=+$/, '').toUpperCase();

    for (let i = 0; i < input.length; i++) {
        const val = alphabet.indexOf(input[i]);
        if (val === -1) throw new Error('Invalid base32 character');
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
        output += String.fromCharCode(parseInt(bits.substring(i, i + 8), 2));
    }

    return output;
}
