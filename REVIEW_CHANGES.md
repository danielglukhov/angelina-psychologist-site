# Что изменено

- Пересобраны цветовые, типографические, spacing-, radius- и shadow-токены.
- Исправлен отсутствующий `--shadow-lg`.
- Упрощены и выровнены глобальные стили.
- Обновлены Hero и About с корректными пропорциями фотографий.
- Requests переведён из обычных карточек в спокойный редакционный список.
- Services сделан набором полноценных кликабельных карточек.
- Video получил аккуратную заглушку до публикации ролика.
- FAQ переведён в двухколоночную композицию.
- CTA получил более сильную визуальную иерархию.
- Header получил адаптивное мобильное меню.
- Footer получил полноценную навигацию и структуру.
- Обновлена документация дизайн-системы.

## Важно

В `astro.config.mjs` пока указан `https://example.com`. Перед публикацией замените его на реальный домен.

Сборку в текущем окружении полностью проверить не удалось: переустановка npm-зависимостей превысила лимит времени. На локальной машине выполните:

```bash
npm install
npm run build
```

## 2026-07-26 – Online service page

- Rebuilt `/services/online` as a complete landing page.
- Added transparent conditions: 50 minutes, $51, adults 18+, video required.
- Added platforms and payment options.
- Added service requests, first-session flow, practice boundaries and online FAQ.
- Converted the Batumi consultation price from 175 GEL to a rounded fixed website price of $67.
