# Portfolio App Frontend

Frontend web application for investment portfolio management and analysis, built with Next.js 15.

⚠️ **Note**: This project is under active development.

## Overview

Portfolio management application with three main modules:

- **Portfolio** - asset value visualization with interactive charts
- **Transactions** - trading operations and position management
- **Analytics** - performance analysis and metrics

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19** + TypeScript
- **Tailwind CSS** + Radix UI components
- **Recharts** for data visualization
- **React Hook Form** + Zod validation
- **Zustand** for state management
- **TanStack Query** / SWR for data fetching

## Getting Started

### Prerequisites

- Node.js 18+
- Running backend server ([portfolio-app](https://github.com/vvvlladimir/portfolio-app))

### Installation

```bash
# Clone repository
git clone https://github.com/vvvlladimir/portfolio-app-frontend.git
cd portfolio-app-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local and set API_URL

# Run development server
npm run dev
```

Application will be available at [http://localhost:3000](http://localhost:3000)

### Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up

# Production
docker-compose up -d
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run lint     # Run linter
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Backend API URL | `http://localhost:8000` |
| `NODE_ENV` | Environment | `development` |

## Project Structure

```
src/
├── app/              # Next.js pages and layouts
├── config/           # Configuration files
└── shared/           # Shared resources
    ├── api/          # API client and queries
    ├── stores/       # Zustand stores
    └── types/        # TypeScript types
```

## License

Private project. All rights reserved.
