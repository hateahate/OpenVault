import { generateTOTP } from '../utils/crypto/totpGenerator';
import { base32Decode } from '../utils/crypto/base32';

describe('base32Decode', () => {
  test('decodes valid base32 string', () => {
    expect(base32Decode('MFRGGZDFMZTWQ2LK')).toBe('abcdefghij');
  });

  test('throws on invalid character', () => {
    expect(() => base32Decode('@@@')).toThrow('Invalid base32 character');
  });
});

describe('generateTOTP', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(59000); // RFC vector time 59s
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('generates correct code for RFC vector', () => {
    const otp = generateTOTP('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 30, 8);
    expect(otp).toBe('94287082');
  });

  test('throws for invalid secret', () => {
    expect(() => generateTOTP('INV@LID', 30, 6)).toThrow('Invalid base32 character');
  });
});
