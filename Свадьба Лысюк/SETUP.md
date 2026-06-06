# Свадебный сайт — Даниил & София · 09.09.2026

## Запуск проекта

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev

# 3. Открыть в браузере
# http://localhost:3000
```

## Добавление фотографий

Все фотографии пары кладутся в папку `public/photos/`.

В компонентах замените placeholder-дивы на `<Image>` из `next/image`:

```tsx
import Image from "next/image";

// Вместо div-placeholder:
<Image
  src="/photos/hero.jpg"
  alt="Даниил и София"
  fill
  className="object-cover"
  priority
/>
```

### Рекомендуемые имена файлов:
| Файл | Где использовать |
|------|-----------------|
| `hero.jpg` | HeroSection — главный фон |
| `story-1.jpg` → `story-5.jpg` | LoveStorySection — галерея |
| `final.jpg` | FinalSection — финальный фон |

## Что нужно заполнить

| Поле | Файл |
|------|------|
| Адрес площадки | `components/LocationSection.tsx` → `address` |
| Ссылка на Яндекс Карты | `components/LocationSection.tsx` → `yandexMapsUrl` |
| Название площадки | `components/LocationSection.tsx` → h3 текст |
| Время тайминга дня | `components/TimelineSection.tsx` → `events[].time` |
| Цвета дресс-кода | `components/DressCodeSection.tsx` → `palette[]` |
| Форма RSVP backend | `components/RsvpSection.tsx` → `handleSubmit` |

## Подключение формы RSVP

В `components/RsvpSection.tsx` найдите `handleSubmit` и замените заглушку на реальный запрос:

### Вариант 1 — Formspree (бесплатно):
```tsx
const res = await fetch("https://formspree.io/f/YOUR_ID", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, attending, guests, comment }),
});
```

### Вариант 2 — Google Sheets через Apps Script:
```tsx
await fetch("YOUR_APPS_SCRIPT_URL", {
  method: "POST",
  body: JSON.stringify({ name, attending, guests, comment }),
});
```

## Встройка карты

В `components/LocationSection.tsx` замените placeholder карты на iframe:

```tsx
<iframe
  src="https://yandex.ru/map-widget/v1/?ll=37.618423,55.751244&z=15&pt=37.618423,55.751244"
  width="100%"
  height="100%"
  frameBorder="0"
  className="absolute inset-0"
/>
```

## Деплой

```bash
# Сборка
npm run build

# Vercel (рекомендуется)
npx vercel

# Или статический экспорт
# В next.config.ts добавить: output: "export"
npm run build
```
