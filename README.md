# WriteFlow

A blogging platform built with Next.js 15, TypeScript, and Prisma. Users can create, edit, and publish blog posts with a rich text editor, manage drafts, interact with content through likes/dislikes, and engage in community discussions.

## 🚀 Features

- **Rich Text Editor**: Blog post creation with TipTap editor supporting code blocks, images, text alignment, and syntax highlighting
- **User Authentication**: Authentication with NextAuth.js supporting Google OAuth and email/password
- **Draft Management**: Save and manage multiple drafts before publishing
- **Content Interaction**: Like/dislike system for blogs and comments
- **Comment System**: Engage with readers through threaded comments
- **Category System**: Organize content with customizable categories
- **User Profiles**: Follow other users and track reading history
- **Image Upload**: Cloudinary integration for blog post images
- **Responsive Design**: Mobile-first design with Tailwind CSS and DaisyUI
- **Real-time Updates**: React Query for efficient data fetching and caching

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - CSS framework
- **DaisyUI** - Component library built on Tailwind
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **TipTap** - Rich text editor
- **React Hook Form** - Form management with Zod validation
- **React Query (TanStack)** - Data fetching and state management
- **Redux Toolkit** - Global state management

### Backend & Database
- **Prisma** - ORM
- **PostgreSQL** - Database
- **NextAuth.js** - Authentication
- **Prisma Accelerate** - Database acceleration
- **bcrypt** - Password hashing

### Infrastructure & Services
- **Cloudinary** - Image hosting
- **Google OAuth** - Social authentication
- **Vercel** - Deployment platform

## 📦 Key Dependencies

### Core Dependencies
```json
{
  "next": "^15.5.9",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5",
  "@prisma/client": "^6.6.0",
  "next-auth": "^4.24.11",
  "@tiptap/react": "^2.12.0",
  "@tanstack/react-query": "^5.75.2",
  "@reduxjs/toolkit": "^2.8.1",
  "tailwindcss": "^4",
  "daisyui": "^5.0.28"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.3.1",
  "tsx": "^4.19.4",
  "@faker-js/faker": "^9.7.0"
}
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Authentication, profiles, and relationships
- **Blogs**: Published content with metadata
- **Drafts**: Unpublished blog posts
- **BlogContent**: Rich content storage (JSON)
- **Categories**: Content organization
- **Comments**: User interactions
- **Accounts/Sessions**: NextAuth.js authentication tables

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/writedatabase
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=your-nextauth-secret-key
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)
- Cloudinary account (optional, for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WriteFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed  # Optional: seed with sample data
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
WriteFlow/
├── app/                    # Next.js App Router pages
│   ├── (guest)/           # Guest-only routes
│   ├── (root)/            # Public routes
│   ├── (user)/            # Authenticated user routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── libs/                  # Utility libraries and providers
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── schemas/               # Zod validation schemas
├── types/                 # TypeScript type definitions
└── generated/             # Generated Prisma client
```

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

## 🚀 Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment
1. Build the application: `npm run build`
2. Set environment variables on your hosting platform
3. Start the production server: `npm run start`

## 🔒 Security

- CSRF protection via NextAuth.js
- Password hashing with bcrypt
- Environment variable validation
- SQL injection prevention via Prisma
- XSS protection with React
- Image upload security through Cloudinary

## 📊 Performance

- Next.js 15 with Turbopack
- React Query for data caching
- Image optimization with Next.js Image component
- Prisma Accelerate for database optimization
- Code splitting and lazy loading
- Tailwind CSS purging