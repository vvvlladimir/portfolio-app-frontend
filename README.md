# Portfolio App Frontend

Современное веб-приложение для управления и анализа инвестиционного портфеля, построенное на базе Next.js 15.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Функциональные возможности](#функциональные-возможности)
- [Технологический стек](#технологический-стек)
- [Требования](#требования)
- [Установка и запуск](#установка-и-запуск)
  - [Локальная разработка](#локальная-разработка)
  - [Docker](#docker)
- [Конфигурация](#конфигурация)
- [Структура проекта](#структура-проекта)
- [Разработка](#разработка)
- [Связанные репозитории](#связанные-репозитории)
- [Вклад в проект](#вклад-в-проект)
- [Лицензия](#лицензия)

## 📖 Описание проекта

Portfolio App Frontend — это клиентское приложение для системы управления инвестиционным портфелем. Приложение предоставляет интуитивный интерфейс для отслеживания инвестиций, анализа сделок и визуализации данных портфеля.

⚠️ **Внимание**: Проект находится в стадии активной разработки и пока не предоставляет полностью функциональное приложение.

## ✨ Функциональные возможности

### Основные модули:

- **📊 Портфель** — визуализация динамики стоимости портфеля с интерактивными графиками
  - Отображение текущей стоимости активов
  - Исторические данные по изменению стоимости
  - Графическое представление распределения активов

- **💼 Транзакции** — управление торговыми операциями и текущими позициями
  - Просмотр и фильтрация всех транзакций
  - Детальная информация по каждой сделке
  - Управление текущими открытыми позициями

- **📈 Аналитика** — инструменты для анализа эффективности инвестиций
  - Обзор основных метрик портфеля
  - Анализ доходности
  - Статистика по категориям активов

## 🛠 Технологический стек

### Основные технологии:

- **Framework**: [Next.js 15](https://nextjs.org/) с App Router и Turbopack
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [Radix UI](https://www.radix-ui.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) с [Zod](https://zod.dev/) валидацией
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest) и [SWR](https://swr.vercel.app/)
- **Tables**: [TanStack Table](https://tanstack.com/table/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **TypeScript**: Полная типизация

### DevOps:

- **Containerization**: Docker и Docker Compose
- **Code Quality**: ESLint
- **Build Tool**: Turbopack (встроен в Next.js 15)

## 📦 Требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** версии 18.0 или выше
- **npm** (поставляется с Node.js) или **yarn**
- **Git** для клонирования репозитория
- **Docker** и **Docker Compose** (опционально, для контейнеризации)
- Работающий **backend сервер** ([portfolio-app](https://github.com/vvvlladimir/portfolio-app))

## 🚀 Установка и запуск

### Локальная разработка

1. **Клонируйте репозиторий:**

```bash
git clone https://github.com/vvvlladimir/portfolio-app-frontend.git
cd portfolio-app-frontend
```

2. **Установите зависимости:**

```bash
npm install
```

3. **Настройте переменные окружения:**

Создайте файл `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Отредактируйте `.env.local` и укажите URL вашего backend API:

```env
API_URL=http://localhost:8000
NODE_ENV=development
```

4. **Запустите приложение в режиме разработки:**

```bash
npm run dev
```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

5. **Сборка production версии:**

```bash
npm run build
npm start
```

### Docker

#### Разработка с Docker Compose

Для быстрого запуска в режиме разработки:

```bash
docker-compose -f docker-compose.dev.yml up
```

#### Production развертывание

1. **Сборка Docker образа:**

```bash
docker build -t portfolio-app-frontend .
```

2. **Запуск с Docker Compose:**

Отредактируйте `docker-compose.yml`, установите нужные переменные окружения:

```yaml
environment:
  - NODE_ENV=production
  - API_URL=https://your-api-url.com
```

Затем запустите:

```bash
docker-compose up -d
```

Приложение будет доступно на порту 3000.

## ⚙️ Конфигурация

### Переменные окружения

Создайте файл `.env.local` в корне проекта со следующими переменными:

| Переменная | Описание | Значение по умолчанию | Обязательная |
|-----------|----------|----------------------|--------------|
| `API_URL` | URL адрес backend API | `http://localhost:8000` | ✅ Да |
| `NODE_ENV` | Окружение (`development`, `production`) | `development` | Нет |

**Пример `.env.local`:**

```env
# API Configuration
API_URL=http://localhost:8000

# Environment
NODE_ENV=development
```

### Конфигурационные файлы

- `next.config.ts` — конфигурация Next.js
- `tsconfig.json` — настройки TypeScript
- `eslint.config.mjs` — правила линтинга
- `tailwind.config.ts` — конфигурация Tailwind CSS (если есть)
- `components.json` — конфигурация Radix UI компонентов

## 📁 Структура проекта

```
portfolio-app-frontend/
├── src/
│   ├── app/                    # Next.js App Router страницы
│   │   ├── layout.tsx         # Корневой layout
│   │   ├── page.tsx           # Главная страница (портфель)
│   │   ├── providers.tsx      # Глобальные провайдеры
│   │   ├── transactions/      # Страница транзакций
│   │   └── analytics/         # Страница аналитики
│   ├── config/                # Конфигурационные файлы
│   │   └── api.ts            # API конфигурация
│   └── shared/                # Общие ресурсы
│       ├── api/              # API клиент и запросы
│       │   ├── client.ts     # HTTP клиент
│       │   └── queries/      # React Query хуки
│       ├── stores/           # Zustand stores
│       └── types/            # TypeScript типы
├── public/                    # Статические файлы
│   ├── *.proto               # Protocol Buffers схемы
│   └── *.svg                 # SVG иконки
├── .env.example              # Пример переменных окружения
├── Dockerfile                # Docker конфигурация
├── docker-compose.yml        # Docker Compose для production
├── docker-compose.dev.yml    # Docker Compose для разработки
├── next.config.ts            # Next.js конфигурация
├── package.json              # Зависимости проекта
└── tsconfig.json             # TypeScript конфигурация
```

## 💻 Разработка

### Доступные скрипты

```bash
# Запуск dev сервера с Turbopack
npm run dev

# Сборка production версии
npm run build

# Запуск production сервера
npm start

# Проверка кода линтером
npm run lint
```

### Соглашения о коде

- Используйте **TypeScript** для всех новых файлов
- Следуйте правилам **ESLint** конфигурации
- Компоненты размещайте в соответствующих директориях
- Используйте **React Hooks** и функциональные компоненты
- Применяйте **Tailwind CSS** для стилизации

### Работа с API

Все запросы к API должны использовать:
- **React Query** (`@tanstack/react-query`) для мутаций и сложных запросов
- **SWR** для простых GET запросов с автоматической ревалидацией

Примеры запросов находятся в `src/shared/api/queries/`

### Управление состоянием

- Локальное состояние компонентов: `useState`, `useReducer`
- Глобальное состояние: **Zustand** (`src/shared/stores/`)
- Серверное состояние: **React Query** / **SWR**
- Формы: **React Hook Form** с **Zod** валидацией

## 🔗 Связанные репозитории

**Backend API**: [portfolio-app](https://github.com/vvvlladimir/portfolio-app)  
*Серверное приложение, предоставляющее REST API для управления данными портфеля*

Для полноценной работы приложения необходимо развернуть и запустить backend сервер.

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! Если вы хотите внести изменения:

1. Форкните репозиторий
2. Создайте ветку для ваших изменений (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Рекомендации

- Опишите изменения в Pull Request
- Убедитесь, что код проходит линтинг (`npm run lint`)
- Проверьте, что приложение собирается без ошибок (`npm run build`)
- Следуйте существующему стилю кода

## 📄 Лицензия

Этот проект является частным и не имеет открытой лицензии. Все права защищены.

---

**Автор**: [vvvlladimir](https://github.com/vvvlladimir)  
**Репозиторий**: [portfolio-app-frontend](https://github.com/vvvlladimir/portfolio-app-frontend)
