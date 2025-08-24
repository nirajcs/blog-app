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

### Bonus Features
- **Search & Filter**: Search posts by title/content
- **Pagination**: Efficient post listing with pagination
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Updates**: Dynamic content updates

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

### 4. Database Setup
- **Local MongoDB**: Ensure MongoDB is running locally
- **MongoDB Atlas**: Use your Atlas connection string

### 5. Run the Application
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

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set environment variables in deployment platform
3. Deploy automatically on push to main branch

### Backend Deployment
- **Vercel**: Automatic deployment with Next.js API routes
- **Netlify**: Functions for API routes
- **Railway/Render**: Alternative deployment options

### Database Deployment
- **MongoDB Atlas**: Free tier available
- **Railway**: Managed MongoDB instances
- **Self-hosted**: Local or VPS deployment

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Get all posts (with pagination/search)
- `POST /api/posts` - Create new post (authenticated)
- `GET /api/posts/[id]` - Get specific post
- `PUT /api/posts/[id]` - Update post (authorized users)
- `DELETE /api/posts/[id]` - Delete post (authorized users)

### User Management
- `GET /api/user/profile` - Get user profile (authenticated)
- `PUT /api/user/profile` - Update user profile (authenticated)

### Admin (Admin users only)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/posts` - Get all posts with author details

## 🎨 Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update `src/app/globals.css` for global styles
- Component-specific styles in individual components

### Features
- Add new user roles in `src/models/User.ts`
- Extend post model with additional fields
- Implement commenting system
- Add image upload functionality

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in `.env.local`
   - Ensure network access for Atlas

2. **JWT Authentication Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration
   - Clear browser cookies

3. **Build Errors**
   - Clear `.next` folder
   - Reinstall dependencies
   - Check TypeScript errors

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 🎯 Roadmap

- [ ] Comment system implementation
- [ ] Image upload and management
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] User following system
- [ ] API rate limiting
- [ ] Unit and integration tests
- [ ] Docker containerization

---

**Happy Blogging! 🚀**
