# OpenDev Labs - Deployment Guide

## Project Overview

**Dynamic Software Company Platform** - A premium Next.js 16 website for OpenDev Labs with professional design, smooth animations, and interactive booking system.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v3
- Framer Motion (animations)
- TypeScript
- shadcn/ui components

## Deployed Features

### Pages

1. **Homepage** (`/`) - Premium landing page with:
   - Animated hero section ("Software That Thinks")
   - Stats showcase (500+, 98%, 50M+, 10yr)
   - Services grid with featured items
   - Testimonials carousel
   - Team showcase section
   - Portfolio/Featured work
   - Red accent CTA box

2. **Booking Page** (`/booking`) - Multi-step appointment booking:
   - Step 1: Service selection ($500-$750)
   - Step 2: Date picker
   - Step 3: Time slot selection
   - Step 4: Confirmation review

### Premium Components

- `AnimatedHero` - Staggered text animations
- `AnimatedCard` - Hover effects and entrance animations
- `PremiumCard` - Service/feature cards
- `Testimonials` - Interactive carousel
- `TeamSection` - Team member showcase
- `Header` - Sticky navigation

## Development

### Install & Run

```bash
npm install
npm run dev
```

Server: `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Deployment to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Auto-deploys on push

## Design System

**Colors**:
- Primary: Black (#000000)
- Background: White (#ffffff)
- Accent: Red (#dc2626)
- Muted: Gray (#666666)
- Border: Light Gray (#e5e5e5)

**Typography**:
- Headings: Geist Sans (5xl-7xl, bold, tight tracking)
- Body: Geist Sans (base-lg, leading-relaxed)

**Layout**:
- Max-width: 7xl (80rem)
- Responsive padding: 6-8 units
- Section borders: Black dividers
- Animations: 300-500ms smooth transitions

## File Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Homepage with all sections
├── booking/page.tsx        # Booking wizard
└── globals.css             # Tailwind + custom styles

components/
├── Header.tsx              # Navigation
├── AnimatedHero.tsx        # Hero with animations
├── AnimatedCard.tsx        # Card with entrance animation
├── PremiumCard.tsx         # Service cards
├── Testimonials.tsx        # Carousel
├── TeamSection.tsx         # Team showcase
└── ui/                     # shadcn components
```

## Environment Variables (Optional)

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

## Performance Targets

- Lighthouse: 90+
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Animations: 60fps

## Future Enhancements

1. Google OAuth integration
2. Database for appointments/team data
3. Blog/CMS
4. Real-time booking availability
5. Admin dashboard
6. Email notifications
7. Analytics tracking

## Documentation

- Next.js: https://nextjs.org/docs
- Tailwind: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion/
- shadcn/ui: https://ui.shadcn.com/
