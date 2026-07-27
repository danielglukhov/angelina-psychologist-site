# Обновление брендинга и SEO

## Подключённые материалы

- Основной горизонтальный логотип используется в шапке и футере.
- Подключены SVG- и PNG-фавиконы.
- `apple-touch-icon.png` исправлен до 180×180 px.
- Добавлен `site.webmanifest` с иконками 512×512.
- `og-default.jpg` используется как стандартное изображение для Telegram, WhatsApp и соцсетей.

## Контакты в футере

Добавлены ссылки с иконками:

- Telegram;
- WhatsApp;
- профиль на B17: `https://www.b17.ru/gluhova_angelina/`.

## SEO

- единые canonical URL;
- title и description для всех страниц;
- Open Graph и Twitter Card;
- размеры и alt для OG-изображения;
- `article:published_time` и `article:modified_time` для статей;
- структурированные данные Person, WebSite, BreadcrumbList и Article;
- единый файл `robots.txt`, генерируемый Astro;
- sitemap через `@astrojs/sitemap`;
- удалена незаполненная страница политики конфиденциальности;
- удалён конфликтующий статический `public/robots.txt` с `example.com`.

## Перед публикацией

Указать реальный домен:

```bash
SITE_URL=https://ваш-домен
```

После этого выполнить:

```bash
npm install
npm run build
```

## Header and footer brand refinement
- Replaced the oversized horizontal logo in the header with the compact brand mark and live HTML text.
- The header identity now remains readable at desktop and mobile sizes without wasting horizontal space.
- Rebuilt the footer identity from the same mark and typography for a consistent brand system.
- Replaced heavy circular social buttons with clean, consistently sized Telegram, WhatsApp, and B17 marks.
