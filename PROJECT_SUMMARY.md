# OpenDev Labs - Premium Software Company Site

A modern, dynamic software company website built with Next.js 16, showcasing services, portfolio, team, and an integrated booking system.

## Features

### Core Pages
- **Home** (`/`) - Premium landing page with hero, services, testimonials, team, and portfolio sections
- **Booking** (`/booking`) - Multi-step appointment booking system with service selection, date/time picking, and confirmation

### Premium Components
- **Header** - Sticky navigation with mobile menu, logo, and CTA button
- **AnimatedHero** - Staggered entrance animations for compelling first impressions
- **PremiumCard** - Featured and standard cards for services and portfolio items
- **AnimatedCard** - Framer Motion-powered cards with hover effects
- **Testimonials** - Interactive carousel with smooth transitions
- **TeamSection** - Team member showcase with individual animations

### Design System
- **Color Palette**: Clean black, white, and red accent (#dc2626)
- **Typography**: Geist font family (sans + mono)
- **Spacing**: Tailwind's spacing scale for consistent rhythm
- **Responsive**: Mobile-first design with breakpoints at sm, md, lg

### Dynamic Features
- Multi-step booking flow with progress tracking
- Interactive testimonial carousel
- Animated scroll-triggered components
- Staggered card animations
- Smooth button hover states and transitions

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion
- **Component Library**: Custom premium components
- **Language**: TypeScript

## Project Structure

```
/app
  ├── layout.tsx           # Root layout with metadata
  ├── globals.css          # Global styles and component classes
  ├── page.tsx             # Home page
  └── booking/
      └── page.tsx         # Booking page

/components
  ├── Header.tsx           # Navigation header
  ├── PremiumCard.tsx      # Card component
  ├── AnimatedCard.tsx     # Animated card wrapper
  ├── AnimatedHero.tsx     # Hero section with animations
  ├── Testimonials.tsx     # Testimonials carousel
  └── TeamSection.tsx      # Team showcase

/public                     # Static assets
```

## Getting Started

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build
```bash
npm run build
npm start
```

## Key Features Explained

### Booking System
Multi-step form with 4 stages:
1. Service selection with pricing
2. Date picker with calendar input
3. Time slot selection (12-hour format)
4. Confirmation with summary

### Animations
- Hero section: Staggered entrance on page load
- Service cards: Fade-in with scale on scroll
- Testimonials: Smooth carousel transitions
- Team cards: Individual animations with hover lift

### Responsive Design
- Header: Full navigation on desktop, hamburger menu on mobile
- Grid layouts: Auto-adjusts from 1 to 4 columns based on screen size
- Typography: Scales from mobile to desktop
- Spacing: Consistent padding/margins using Tailwind scale

## Color Usage

The design uses a minimal 3-color system:
- **Primary (Black #000)**: Main text, buttons, borders
- **Neutral (White #fff)**: Backgrounds
- **Accent (Red #dc2626)**: Featured elements, CTAs, highlights

## Performance Optimizations

- Server-side rendered pages for fast initial load
- Framer Motion for GPU-accelerated animations
- Optimized image loading with Next.js Image component
- Minimal CSS with Tailwind's PurgeCSS
- No external icon libraries (using Unicode emojis)

## Customization

### Update Company Info
Edit component content in:
- Header: Brand name, navigation links
- Home: Services, team members, portfolio items
- Booking: Service offerings, pricing

### Change Colors
Update Tailwind config in `tailwind.config.js`:
```js
colors: {
  background: '#ffffff',
  foreground: '#000000',
  accent: '#dc2626',
  // Add more colors here
}
```

### Add More Services
Edit the `services` array in `/app/page.tsx`:
```js
const services = [
  { title: '', description: '', icon: '', featured: false },
  // Add more services
]
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android

## Deployment

Deploy to Vercel with one click:
- All environment variables auto-configured
- Automatic preview deployments for branches
- Edge middleware support for future enhancements

## Future Enhancements

- Email confirmation integration
- Payment processing for bookings
- Blog section with CMS integration
- Client dashboard
- Project timeline tracking
- Live chat support
- Analytics integration

---

**Built with** Next.js 16 + Tailwind CSS + Framer Motion  
**Design**: Premium, minimal, bold typography
