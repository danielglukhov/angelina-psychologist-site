import { currencies, type Currency } from '../config/prices';
export type Rates = Record<Currency, number>;
export type RateCache = { rates: Rates; fetchedAt: number; updatedAt: number };
const KEY = 'psyway.rates.v1';
const DAY = 86400000;
export const readStorage = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
export const writeStorage = (key: string, value: string) => { try { localStorage.setItem(key, value); } catch { /* Private mode: use memory. */ } };
export function validRates(rates: any): rates is Rates {
  return !!rates && rates.USD === 1 && currencies.every(code => typeof rates[code] === 'number' && Number.isFinite(rates[code]) && rates[code] > 0);
}
export async function fetchJson(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try { const response = await fetch(url, { signal: controller.signal, credentials: 'omit' }); if (!response.ok) throw new Error('HTTP ' + response.status); return await response.json(); }
  finally { clearTimeout(timeout); }
}
export class CurrencyService {
  private pending?: Promise<RateCache | null>;
  getRates() { return this.pending ??= this.load(); }
  private async load(): Promise<RateCache | null> {
    let cached: RateCache | null = null;
    try {
      const parsed = JSON.parse(readStorage(KEY) || 'null');
      if (parsed && validRates(parsed.rates) && Number.isFinite(parsed.fetchedAt) && parsed.fetchedAt <= Date.now() && Number.isFinite(parsed.updatedAt) && parsed.updatedAt > 0 && parsed.updatedAt <= Date.now()) cached = parsed;
    } catch { /* Ignore malformed cache. */ }
    if (cached && Date.now() - cached.fetchedAt < DAY) return cached;
    try {
      const data = await fetchJson('https://open.er-api.com/v6/latest/USD');
      if (data.result !== 'success' || data.base_code !== 'USD' || !validRates(data.rates) || !Number.isFinite(data.time_last_update_unix) || data.time_last_update_unix <= 0 || data.time_last_update_unix * 1000 > Date.now()) throw new Error('Invalid rates');
      const result = { rates: Object.fromEntries(currencies.map(code => [code, data.rates[code]])) as Rates, fetchedAt: Date.now(), updatedAt: data.time_last_update_unix * 1000 };
      writeStorage(KEY, JSON.stringify(result));
      return result;
    } catch { return cached; }
  }
}
export function convert(amount: number, base: Currency, target: Currency, rates?: Rates): number | null {
  if (base === target) return amount;
  if (!rates) return null;
  const result = amount / rates[base] * rates[target];
  return Number.isFinite(result) && result > 0 ? result : null;
}
