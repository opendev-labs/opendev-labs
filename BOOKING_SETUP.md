# Appointment Booking System - Setup Guide

## Overview

Your new premium dark-themed appointment booking system is now integrated! This guide will help you set up Google OAuth and Google Calendar integration.

## Quick Start

### 1. **Set Up Google OAuth**

To enable Google Sign-In, you need a Google OAuth 2.0 Client ID:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - Google Calendar API
   - Google+ API
4. Go to "Credentials" → Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (alternative dev)
   - Your production domain (when deployed)
6. Copy your Client ID

### 2. **Add Your Google Client ID**

Update the environment variable in `.env.development.local`:

```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Restart your dev server after updating.

### 3. **Access the Booking System**

- **Landing Page**: `/book` - Premium landing page with service showcase
- **Book Appointment**: `/booking` - Appointment booking flow (requires login)
- **Admin Dashboard**: `/dashboard` - Manage services and view appointments

## Features Included

### 🎨 **Premium Dark Theme**
- Modern dark navy background (#0a0e27)
- Blue/Purple/Cyan accents for professional look
- Glassmorphism effects and smooth animations
- Fully responsive design

### 🔐 **Google Authentication**
- Secure Google OAuth 2.0 login
- User profile stored locally
- One-click sign-in/sign-out

### 📅 **Appointment Booking**
- Multi-step booking wizard
- Service selection
- Date & time picker
- Confirmation with optional notes
- Client appointment tracking

### 🗓️ **Google Calendar Integration**
- Real-time availability checking (when access token provided)
- Automatic event creation
- Sync with your Google Calendar
- Delete appointments from calendar

### 👨‍💼 **Admin Dashboard**
- View all upcoming appointments
- Manage services (add/edit/delete)
- Track appointment statistics
- Full booking management

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Premium navigation bar
│   ├── GoogleLoginButton.tsx    # Google login button
│   └── ui/
│       └── button.tsx           # Shadcn button component
├── context/
│   ├── AuthContext.tsx          # Google OAuth auth context
│   └── ServicesContext.tsx      # Services & appointments state
├── lib/
│   └── googleCalendar.ts        # Google Calendar API helper
├── pages/
│   ├── BookingLanding.tsx       # Landing page
│   ├── BookingPage.tsx          # Booking flow
│   └── AdminDashboard.tsx       # Admin dashboard
├── types/
│   └── index.ts                 # TypeScript types
└── index.css                    # Dark theme design tokens
```

## Design System

### Colors (Dark Theme)
- **Background**: #0a0e27 (Deep Navy)
- **Foreground**: #f8fafc (Light Text)
- **Primary**: #3b82f6 (Blue)
- **Secondary**: #8b5cf6 (Purple)
- **Accent**: #06b6d4 (Cyan)
- **Muted**: #334155 (Gray)

### Typography
- Headings: Bold sans-serif
- Body: Regular sans-serif
- All text properly sized for accessibility

## API Integration Points

### Google Calendar API
When the user provides their access token through Google OAuth, the system can:

1. **Check Availability** - Query free/busy times
2. **Create Events** - Add appointments to their calendar
3. **Delete Events** - Remove cancelled appointments

The `src/lib/googleCalendar.ts` file provides helper functions for these operations.

## Data Storage

Currently, the system uses **localStorage** for persistence:
- User sessions
- Services list
- Appointments list

For production, you'll want to replace this with a backend database (Neon, Supabase, etc.).

## Environment Variables

Required:
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID

Optional (for future use):
- `VITE_CALENDAR_EMAIL` - Admin email for calendar syncing
- `DATABASE_URL` - For backend integration

## Testing the System

1. **Sign In**: Click "Sign in with Google" on the landing page
2. **Book Appointment**: 
   - Select a service
   - Pick a date (next 14 business days)
   - Choose a time slot
   - Confirm booking
3. **View Dashboard**: Check /dashboard to see all appointments
4. **Manage Services**: Add/edit/delete services from dashboard

## Customization

### Add New Services
In the Admin Dashboard, click "Add Service" and fill in:
- Service name
- Description
- Duration (minutes)
- Price
- Icon (emoji)
- Gradient color

### Change Theme Colors
Edit `src/index.css` - look for the CSS variables in the `:root` and `.dark` sections.

### Modify Landing Page
Edit `src/pages/BookingLanding.tsx` to:
- Change hero text
- Add your portfolio items
- Customize features section
- Update footer

## Next Steps

1. ✅ Set up Google OAuth Client ID
2. ✅ Add environment variable
3. ✅ Test the booking flow
4. ✅ Customize services and content
5. 📱 Test on mobile devices
6. 🚀 Deploy to Vercel
7. 🔄 Connect to backend database for production

## Troubleshooting

**"Google OAuth not working"**
- Verify VITE_GOOGLE_CLIENT_ID is set
- Check that your domain is in authorized redirect URIs
- Ensure Google+ API is enabled in Google Cloud Console

**"Appointments not saving"**
- Check browser localStorage is enabled
- Clear localStorage if needed: `localStorage.clear()`
- For production, implement backend database

**"Styling looks off"**
- Ensure you're using the dark theme: Add `class="dark"` to `<html>`
- Check that `index.css` is imported in `main.tsx`
- Clear browser cache and restart dev server

## Support

For issues or questions:
1. Check the Google OAuth documentation: https://developers.google.com/identity/oauth2
2. Check Google Calendar API docs: https://developers.google.com/calendar
3. Review the component code for implementation details

---

**Happy booking! 🚀**
