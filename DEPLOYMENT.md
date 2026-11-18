# Konecta Marketplace - Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Vercel account (for deployment)
- Domain name (optional, for production)

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/konecta"
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3100"
NEXT_PUBLIC_APP_URL="http://localhost:3100"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database
npx ts-node prisma/seed.ts
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3100](http://localhost:3100)

## Production Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Marketplace implementation complete"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `DATABASE_URL` - Your production PostgreSQL URL
   - `NEXTAUTH_SECRET` - Your secret key
   - `NEXTAUTH_URL` - Your production URL (e.g., https://konecta.ao)
   - `NEXT_PUBLIC_APP_URL` - Your production URL

### 3. Deploy

Vercel will automatically deploy on every push to main.

### 4. Run Migrations in Production

After first deployment, run migrations:

```bash
npx prisma migrate deploy
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm test -- --coverage
```

### Run Specific Test File

```bash
npx jest __tests__/validation.test.ts
```

## Test Accounts

After seeding, use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@konecta.ao | admin123 |
| Seller 1 | joao@konecta.ao | seller123 |
| Seller 2 | maria@konecta.ao | seller123 |
| Customer | cliente@konecta.ao | customer123 |

## Security Checklist

- [ ] Environment variables configured
- [ ] NEXTAUTH_SECRET is strong (32+ random characters)
- [ ] Database has SSL enabled in production
- [ ] Rate limiting is active (middleware.ts)
- [ ] Security headers are set (middleware.ts)
- [ ] Password validation is enforced (Zod schemas)
- [ ] Admin routes are protected
- [ ] Seller routes require authentication

## Performance Optimization

- [ ] Images are optimized (Next.js Image component)
- [ ] PWA manifest is configured
- [ ] Mobile touch optimizations are in place
- [ ] Viewport is set for mobile devices
- [ ] Rate limiting prevents API abuse

## Monitoring

- Check Vercel analytics for performance
- Monitor database connections
- Set up error tracking (Sentry recommended)
- Configure uptime monitoring

## Support

For issues, check:
1. Vercel deployment logs
2. Browser console for client errors
3. Database connection status
4. Environment variable configuration