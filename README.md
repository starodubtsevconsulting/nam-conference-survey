# NAM Conference Survey

A mobile-first survey application for collecting anonymous feedback at the Equal Experts North America Conference.

## Quick Start

**Prerequisites:** Docker Desktop

1. Clone and start:
   ```bash
   git clone https://github.com/equalexperts/nam-conference-survey.git
   cd nam-conference-survey
   docker compose up
   ```

2. Open your browser:
   - Survey: http://localhost:3000

That's it. No Node.js, no OAuth, no complicated setup.

## What It Does

- **Public survey** - 19 questions, all optional, no login required
- **Anonymous responses** - Rate-limited to 10 per hour per IP
- **Mobile-first** - Works on any device (375px - 1920px)

## Tech Stack

- Frontend: React + TypeScript + Mantine UI
- Backend: NestJS + Prisma
- Database: PostgreSQL
- Monorepo: pnpm workspaces

## Development

```bash
# Start all services
pnpm dev

# View logs
pnpm logs

# Access database
pnpm prisma:studio

# Run backend tests
docker-compose exec backend pnpm test

# Clean everything (⚠️ deletes data)
pnpm clean
```

## Project Structure

```
apps/
  backend/      # NestJS API + Prisma
  frontend/     # React + Vite
packages/
  shared/       # Shared TypeScript types
product/        # Product discovery, iterations, releases
rules/          # Development guidelines
knowledge/      # Additional context
prompts/        # Feature prompts
```

## Documentation

- Architecture & coding rules: See `rules/` directory
- Prompts: See `prompts/` directory
- Additional context: See `knowledge/` directory
- Database schema: `apps/backend/prisma/schema.prisma`
- Product management: See `product/README.md`

## Contributing

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit
git add .
git commit -m "feat: add my feature"

# Push and create PR
git push origin feature/my-feature
```

Code standards: TypeScript strict mode, ESLint, Prettier, Conventional Commits.

## Support

Questions? Contact Mike Mitchell (Product Owner)

## License

UNLICENSED - Equal Experts Internal Project

## group 8

Pushing commit as test

### ACK
- techroller