# Blog Application with User Management

A modern, full-stack blog application built with Next.js, featuring user authentication, role-based access control, and comprehensive blog management capabilities.

## 🚀 Features

### Core Features
- **User Authentication & Management**
  - User registration and login with JWT
  - Secure password hashing with bcrypt
  - Role-based access control (Admin/User)
  - User profile management

- **Blog Management**
  - Create, Read, Update, Delete (CRUD) blog posts
  - Rich text content support
  - Author attribution and timestamps
  - Public blog listing with search and pagination

- **Role-Based Access**
  - **Admin**: Full access to manage all posts and users
  - **User**: Can create, edit, and delete only their own posts
  - **Public**: Anyone can view published posts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS for responsive design
- **Deployment**: Ready for Vercel/Netlify deployment

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd blog-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your variables:
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

### 4. Add Admin
By default admin credentials are:
  email: 'testadmin@blogapp.com'
  password: 'admin123456'
If you want to change the credentials navigate to
  `/scripts/create-admin.js`
  Change the details in the code and run the code below.
```bash
npm run create-admin
```

### 5. Database Setup
- **Local MongoDB**: Ensure MongoDB is running locally
- **MongoDB Atlas**: Use your Atlas connection string

### 6. Run the Application
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
blog-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── posts/         # Blog post endpoints
│   │   │   ├── user/          # User profile endpoints
│   │   │   └── admin/         # Admin management endpoints
│   │   ├── posts/             # Blog post pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── profile/           # User profile
│   │   ├── admin/             # Admin panel
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/             # Reusable components
│   │   └── Navigation.tsx     # Main navigation
│   ├── contexts/               # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts            # Authentication utilities
│   │   └── mongodb.ts         # Database connection
│   ├── models/                 # Database models
│   │   ├── User.ts            # User model
│   │   └── Post.ts            # Post model
│   └── middleware.ts           # Next.js middleware
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

## 🔐 Authentication Flow

1. **Registration**: Users create accounts with name, email, and password
2. **Login**: JWT token generation and HTTP-only cookie storage
3. **Authorization**: Role-based access control for protected routes
4. **Session Management**: Automatic token validation and user state management

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string,           // User's full name
  email: string,          // Unique email address
  password: string,       // Hashed password
  role: 'admin' | 'user', // User role
  createdAt: Date,        // Account creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Post Model
```typescript
{
  title: string,          // Post title
  content: string,        // Post content
  author: ObjectId,       // Reference to User
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```
---
**Happy Blogging! 🚀**
