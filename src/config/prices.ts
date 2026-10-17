export const currencies = ['USD', 'EUR', 'GEL', 'RUB', 'KZT'] as const;
export type Currency = typeof currencies[number];
export const prices = {
  online: { amount: 51, currency: 'USD' },
  batumi: { amount: 200, currency: 'GEL' },
  couples: { amount: 103, currency: 'USD' },
} as const;
export type Service = keyof typeof prices;
export const symbols: Record<Currency, string> = { USD: '$', EUR: '€', GEL: '₾', RUB: '₽', KZT: '₸' };
export function formatPrice(amount: number, currency: Currency) {
  return symbols[currency] + new Intl.NumberFormat('ru-RU', { maximumFractionDigits: ['USD','EUR'].includes(currency) ? 2 : 0 }).format(amount);
}
// Explicit regional policy; Georgia and Kazakhstan are handled before this list.
const cis = ['AM', 'AZ', 'BY', 'KG', 'MD', 'RU', 'TJ', 'TM', 'UZ'];
const eurozone = ['AT','BE','BG','HR','CY','EE','FI','FR','DE','GR','IE','IT','LV','LT','LU','MT','NL','PT','SK','SI','ES'];
export function currencyForCountry(country: string): Currency {
  const code = country.toUpperCase();
  return code === 'GE' ? 'GEL' : code === 'KZ' ? 'KZT' : cis.includes(code) ? 'RUB' : eurozone.includes(code) ? 'EUR' : 'USD';
}
