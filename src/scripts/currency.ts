import { currencies, currencyForCountry, formatPrice, type Currency } from '../config/prices';
import { CurrencyService, convert, fetchJson, readStorage, writeStorage, type RateCache } from '../services/CurrencyService';
const KEY = 'psyway.currency';
const isCurrency = (value: unknown): value is Currency => currencies.includes(value as Currency);
let manual = isCurrency(readStorage(KEY));
let selected: Currency = manual ? readStorage(KEY) as Currency : 'USD';
let cache: RateCache | null = null;
let loading = true;
const widgets = Array.from(document.querySelectorAll<HTMLElement>('[data-price]'));
function close(widget: HTMLElement, focus = false) {
  const panel = widget.querySelector<HTMLElement>('.currency-selector')!;
  if (panel.matches(':popover-open')) panel.hidePopover();
  panel.hidden = true;
  const trigger = widget.querySelector<HTMLButtonElement>('.price-trigger')!;
  trigger.setAttribute('aria-expanded', 'false');
  if (focus) trigger.focus();
}
function render() {
  widgets.forEach(widget => {
    const base = widget.dataset.base as Currency;
    const amount = Number(widget.dataset.amount);
    const converted = convert(amount, base, selected, cache?.rates);
    const shown = converted === null ? base : selected;
    widget.querySelector('[data-price-value]')!.textContent = formatPrice(converted ?? amount, shown);
    widget.querySelector('[data-price-code]')!.textContent = shown;
    widget.querySelector('.price-trigger')!.setAttribute('aria-label', formatPrice(converted ?? amount, shown) + ' ' + shown + '. Выбрать валюту отображения');
    widget.querySelectorAll<HTMLButtonElement>('[data-currency]').forEach(button => {
      const code = button.dataset.currency as Currency;
      const value = convert(amount, base, code, cache?.rates);
      button.textContent = (value === null ? '—' : formatPrice(value, code)) + ' · ' + code;
      button.disabled = value === null;
      button.setAttribute('aria-pressed', String(code === shown));
    });
    widget.querySelector('[data-rate-status]')!.textContent = cache
      ? 'Ориентировочный пересчёт. Курс от ' + new Date(cache.updatedAt).toLocaleDateString('ru-RU') + (Date.now() - cache.updatedAt > 86400000 * 2 ? '. Последний доступный курс.' : '.')
      : loading ? 'Загружаем курсы. Пока показана базовая стоимость.' : 'Курсы недоступны. Показана базовая стоимость.';
  });
}
widgets.forEach(widget => {
  const trigger = widget.querySelector<HTMLButtonElement>('.price-trigger')!;
  trigger.disabled = false;
  trigger.addEventListener('click', () => {
    const panel = widget.querySelector<HTMLElement>('.currency-selector')!;
    const wasOpen = !panel.hidden;
    widgets.forEach(item => close(item));
    if (!wasOpen) { panel.hidden = false;
      panel.showPopover();
      const rect = trigger.getBoundingClientRect();
      panel.style.left = Math.max(12, Math.min(rect.left, window.innerWidth - panel.offsetWidth - 12)) + 'px';
      panel.style.top = Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - panel.offsetHeight - 12)) + 'px';
      trigger.setAttribute('aria-expanded', 'true'); (panel.querySelector<HTMLButtonElement>('[aria-pressed="true"]:not(:disabled)') ?? panel.querySelector<HTMLButtonElement>('button:not(:disabled)'))?.focus(); }
  });
  widget.querySelectorAll<HTMLButtonElement>('[data-currency]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.currency as Currency; manual = true; writeStorage(KEY, selected); render(); close(widget, true);
  }));
  widget.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(widget, true); }
    if (['ArrowDown','ArrowUp','Home','End'].includes(event.key) && !widget.querySelector<HTMLElement>('.currency-selector')!.hidden) {
      event.preventDefault();
      const options = Array.from(widget.querySelectorAll<HTMLButtonElement>('[data-currency]:not(:disabled)'));
      const i = options.indexOf(document.activeElement as HTMLButtonElement);
      options[event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (i + (event.key === 'ArrowUp' ? -1 : 1) + options.length) % options.length]?.focus();
    }
  });
  widget.addEventListener('focusout', () => setTimeout(() => { if (!widget.contains(document.activeElement)) close(widget); }, 0));
});
window.addEventListener('resize', () => widgets.forEach(widget => close(widget)));
document.addEventListener('click', event => widgets.forEach(widget => { if (!widget.contains(event.target as Node)) close(widget); }));
window.addEventListener('storage', event => { if (event.key === KEY && isCurrency(event.newValue)) { manual = true; selected = event.newValue; render(); } });
async function locate() {
  if (manual) return;
  try {
    const stored = JSON.parse(readStorage('psyway.country') || 'null');
    let country = stored && Date.now() - stored.savedAt < 86400000 && typeof stored.code === 'string' ? stored.code : null;
    if (!country) {
      // Optional same-origin hosting endpoint returns { country_code: "GE" }.
      const data = await fetchJson(import.meta.env.PUBLIC_GEO_ENDPOINT || 'https://ipwho.is/?fields=success,country_code');
      if (data.success === false || !/^[A-Z]{2}$/.test(data.country_code)) throw new Error('No country');
      country = data.country_code;
      writeStorage('psyway.country', JSON.stringify({ code: country, savedAt: Date.now() }));
    }
    if (!manual) selected = currencyForCountry(country);
  } catch { /* USD default. */ }
}
if (widgets.length) {
  render();
  void Promise.all([new CurrencyService().getRates().then(value => { cache = value; }), locate()]).then(() => { loading = false; render(); });
}
