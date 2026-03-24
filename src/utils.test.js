import { describe, it, expect } from 'vitest';
import {
  fiatToSats,
  satsToFiat,
  formatFiat,
  isValidLightningAddress,
  validateInvoiceAmount,
} from './utils.js';

const RATES = {
  ARS: 100_000_000,
  USD: 100_000,
  CLP: 80_000_000,
};

describe('fiatToSats', () => {
  it('converts correctly when rate is available', () => {
    expect(fiatToSats(1, 'ARS', RATES)).toBe(1);
    expect(fiatToSats(1, 'USD', RATES)).toBe(1000);
  });

  it('rounds to nearest sat', () => {
    expect(fiatToSats(1.5, 'ARS', RATES)).toBe(2);
  });

  it('returns null when currency rate is missing', () => {
    expect(fiatToSats(100, 'EUR', RATES)).toBeNull();
  });

  it('returns null when rates object is empty', () => {
    expect(fiatToSats(100, 'USD', {})).toBeNull();
  });

  it('returns null when rates is null/undefined', () => {
    expect(fiatToSats(100, 'USD', null)).toBeNull();
    expect(fiatToSats(100, 'USD', undefined)).toBeNull();
  });

  it('handles zero amount', () => {
    expect(fiatToSats(0, 'USD', RATES)).toBe(0);
  });

  it('handles large amounts', () => {
    expect(fiatToSats(1000, 'USD', RATES)).toBe(1_000_000);
  });
});

describe('satsToFiat', () => {
  it('converts correctly when rate is available', () => {
    expect(satsToFiat(1000, 'USD', RATES)).toBeCloseTo(1.0);
    expect(satsToFiat(1, 'ARS', RATES)).toBe(1);
  });

  it('is consistent with fiatToSats (round-trip)', () => {
    const sats = fiatToSats(500, 'USD', RATES);
    const backToFiat = satsToFiat(sats, 'USD', RATES);
    expect(backToFiat).toBeCloseTo(500, 1);
  });

  it('returns null when currency rate is missing', () => {
    expect(satsToFiat(1000, 'EUR', RATES)).toBeNull();
  });

  it('returns null when rates is null', () => {
    expect(satsToFiat(1000, 'USD', null)).toBeNull();
  });
});

describe('formatFiat', () => {
  it('formats ARS without decimal places', () => {
    const result = formatFiat(1500, 'ARS');
    expect(result).not.toMatch(/,\d{2}$/);
    expect(result).toContain('1');
  });

  it('formats CLP without decimal places', () => {
    const result = formatFiat(2000, 'CLP');
    expect(result).not.toMatch(/,\d{2}$/);
  });

  it('formats USD with decimal places', () => {
    const result = formatFiat(10.5, 'USD');
    expect(result).toMatch(/[\.,]\d{2}/);
  });

  it('formats MXN without decimal places', () => {
    const result = formatFiat(100, 'MXN');
    expect(result).not.toMatch(/,\d{2}$/);
  });
});

describe('isValidLightningAddress', () => {
  it('accepts valid lightning addresses', () => {
    expect(isValidLightningAddress('user@getalby.com')).toBe(true);
    expect(isValidLightningAddress('comerciante@blink.sv')).toBe(true);
    expect(isValidLightningAddress('test.user@domain.co.uk')).toBe(true);
  });

  it('rejects address without @', () => {
    expect(isValidLightningAddress('usergetalby.com')).toBe(false);
  });

  it('rejects address with empty local part', () => {
    expect(isValidLightningAddress('@getalby.com')).toBe(false);
  });

  it('rejects domain without a dot', () => {
    expect(isValidLightningAddress('user@localhost')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidLightningAddress('')).toBe(false);
  });

  it('rejects null/undefined', () => {
    expect(isValidLightningAddress(null)).toBe(false);
    expect(isValidLightningAddress(undefined)).toBe(false);
  });

  it('rejects multiple @ signs', () => {
    expect(isValidLightningAddress('user@host@domain.com')).toBe(false);
  });

  it('handles extra whitespace (trim)', () => {
    expect(isValidLightningAddress('  user@getalby.com  ')).toBe(true);
  });
});

describe('validateInvoiceAmount', () => {
  it('accepts valid amounts', () => {
    expect(validateInvoiceAmount(1).valid).toBe(true);
    expect(validateInvoiceAmount(1000).valid).toBe(true);
    expect(validateInvoiceAmount(10_000_000).valid).toBe(true);
  });

  it('rejects zero sats', () => {
    const result = validateInvoiceAmount(0);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/pequeño/);
  });

  it('rejects null/undefined', () => {
    expect(validateInvoiceAmount(null).valid).toBe(false);
    expect(validateInvoiceAmount(undefined).valid).toBe(false);
  });

  it('rejects amounts over 10M sats', () => {
    const result = validateInvoiceAmount(10_000_001);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/0\.1 BTC/);
  });

  it('accepts exactly 1 sat', () => {
    expect(validateInvoiceAmount(1).valid).toBe(true);
  });

  it('accepts exactly 10M sats', () => {
    expect(validateInvoiceAmount(10_000_000).valid).toBe(true);
  });
});
