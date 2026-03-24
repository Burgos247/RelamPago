/**
 * RelámPago — Pure utility functions
 * Extracted for testability and reuse.
 */

/**
 * Convert fiat amount to satoshis.
 * @param {number} amount - Amount in fiat currency
 * @param {string} currency - Currency code (e.g. 'ARS', 'USD')
 * @param {Object} rates - Map of currency code → BTC price in that currency
 * @returns {number|null} Satoshis, or null if rate is unavailable
 */
export function fiatToSats(amount, currency, rates) {
  if (!rates || !rates[currency]) return null;
  return Math.round((amount / rates[currency]) * 100_000_000);
}

/**
 * Convert satoshis to fiat amount.
 * @param {number} sats - Amount in satoshis
 * @param {string} currency - Currency code
 * @param {Object} rates - Map of currency code → BTC price in that currency
 * @returns {number|null} Fiat amount, or null if rate is unavailable
 */
export function satsToFiat(sats, currency, rates) {
  if (!rates || !rates[currency]) return null;
  return (sats / 100_000_000) * rates[currency];
}

/**
 * Format a fiat amount using locale-aware formatting.
 * Currencies like ARS, CLP, COP, MXN, UYU, VES use no decimal places.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatFiat(amount, currency) {
  const noDecimals = ['ARS', 'CLP', 'UYU', 'COP', 'MXN', 'VES'];
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: noDecimals.includes(currency) ? 0 : 2,
  }).format(amount);
}

/**
 * Validate a Lightning Address (user@domain.com format).
 * @param {string} address
 * @returns {boolean}
 */
export function isValidLightningAddress(address) {
  if (!address || typeof address !== 'string') return false;
  const parts = address.trim().split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length === 0) return false;
  if (!domain || !domain.includes('.')) return false;
  const domainParts = domain.split('.');
  if (domainParts.some(p => p.length === 0)) return false;
  return true;
}

/**
 * Validate satoshi amount for invoice generation.
 * @param {number} sats
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateInvoiceAmount(sats) {
  if (!sats || sats < 1) {
    return { valid: false, error: 'El monto es demasiado pequeño (mínimo 1 sat)' };
  }
  if (sats > 10_000_000) {
    return { valid: false, error: 'El monto supera el límite de 0.1 BTC por cobro' };
  }
  return { valid: true };
}
