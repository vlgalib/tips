# TipMaster

TipMaster - это современное веб-приложение для управления чаевыми в ресторанах, поддерживающее различные способы оплаты, включая криптовалюты.

## Основные функции

- Генерация QR-кодов для получения чаевых
- Поддержка различных способов оплаты (USDC, XMTP, традиционные методы)
- Панель администратора для управления персоналом
- История чаевых и статистика
- Интеграция с криптокошельками
- Уведомления в реальном времени

## Технологии

- Next.js 14
- TypeScript
- Tailwind CSS
- Firebase
- Web3.js
- XMTP Protocol

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/tipmaster.git
cd tipmaster
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env.local` и добавьте необходимые переменные окружения:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Запустите проект в режиме разработки:
```bash
npm run dev
```

## Структура проекта

```
src/
  ├── app/              # Страницы приложения
  ├── components/       # React компоненты
  ├── lib/             # Утилиты и конфигурации
  └── styles/          # Глобальные стили
```

## Лицензия

MIT 