# Docker Setup for Vanta Website

This Next.js application has been containerized for easy deployment and development.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### Production Build

1. Build and run the production container:
```bash
docker-compose up --build
```

2. Access the application at http://localhost:3000

### Development Mode

Run the development container with hot reload:
```bash
docker-compose up dev
```

Access the development server at http://localhost:3001

## Docker Commands

### Build the production image:
```bash
docker build -t vanta-website:latest .
```

### Run the production container:
```bash
docker run -p 3000:3000 --env-file .env.local vanta-website:latest
```

### Stop all containers:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Rebuild without cache:
```bash
docker-compose build --no-cache
```

## Environment Variables

The application requires several environment variables. Create a `.env.local` file with:

- `AIRTABLE_PERSONAL_ACCESS_TOKEN`
- `AIRTABLE_BASE_ID`
- `NEXT_PUBLIC_GTM_ID`
- `NEXT_PUBLIC_GA_ID`
- `ZAPIER_WEBHOOK_URL`
- `ZAPIER_DEMO_WEBHOOK`
- `CALCOM_API_KEY`
- `CALCOM_EVENT_TYPE_ID`
- `OPENAI_API_KEY`
- `CLAUDE_API_KEY`
- And others as defined in docker-compose.yml

## Files Created

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development container with hot reload
- `docker-compose.yml` - Orchestration for both prod and dev
- `.dockerignore` - Excludes unnecessary files from build

## Troubleshooting

1. If the build fails, ensure `next.config.js` has `output: 'standalone'`
2. Check that all required environment variables are set
3. Ensure ports 3000 (prod) and 3001 (dev) are not in use
4. Run `docker-compose logs` to see detailed error messages

## Production Deployment

For production deployment:

1. Build the image: `docker build -t vanta-website:prod .`
2. Push to your container registry
3. Deploy using your preferred orchestration tool (Kubernetes, ECS, etc.)

The production image is optimized for size using multi-stage builds and Next.js standalone output.