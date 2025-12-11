# LEVRA - Digital Marketing Agency

A modern digital marketing agency website built with React, TypeScript, and Supabase.

## Features

- **Modern Landing Page** - Responsive design with animations and testimonials
- **User Authentication** - Secure login/signup with Supabase Auth
- **Admin Dashboard** - Manage clients, projects, and payments
- **Service Booking** - Interactive modals for service selection and quotes
- **Payment Integration** - Handle payments and invoicing
- **Profile Management** - User profiles with avatar upload and URL support
- **Real-time Chat** - AI-powered chatbot assistant
- **Contact Management** - Lead capture and management system

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **UI Components**: Radix UI primitives
- **Animations**: CSS animations and transitions
- **Charts**: Recharts for data visualization

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd levra-agency
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profile information
- `projects` - Client projects and their status
- `payments` - Payment tracking and invoicing
- `messages` - Contact form submissions
- `business_customizations` - Service quote requests
- `contact_requests` - General contact inquiries

## Deployment

The application is ready for production deployment. Make sure to:

1. Configure your Supabase project settings
2. Set up proper environment variables
3. Configure your custom domain if needed
4. Enable appropriate security settings in Supabase

## Security Features

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Protected admin routes and functions
- Input validation and sanitization

## Support

For any questions or issues, please contact the development team.