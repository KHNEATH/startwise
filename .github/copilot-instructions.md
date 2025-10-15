 # GitHub Copilot Instructions for StartWise

## 🎯 Project Overview

StartWise is a comprehensive career platform for startups built with React frontend, Node.js/Express backend, and MySQL database. The platform provides job listings, CV building, user profiles, and a complete admin management system.

## 🏗️ Architecture

### Frontend (React 19.1.1)
- **Location**: `/frontend` directory
- **Port**: 3002 (development)
- **Key Technologies**: React Router, Tailwind CSS, Axios, i18next
- **Build Tool**: Create React App
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS with custom components

### Backend (Node.js/Express)
- **Location**: `/backend` directory  
- **Port**: 5001 (development)
- **Database**: MySQL with connection pooling
- **Authentication**: JWT with bcryptjs
- **API Pattern**: RESTful with proper error handling
- **Environment**: dotenv configuration

## 📁 Code Organization

### Frontend Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── AdminProtectedRoute.js  # Admin route protection
│   ├── ProtectedRoute.js       # User route protection  
│   ├── PrimaryNav.js           # Main navigation
│   └── Footer.js               # Site footer
├── pages/               # Page components
│   ├── Login.js                # Auth with admin detection
│   ├── AdminDashboard.js       # Complete admin interface
│   ├── JobBoard.js             # Job listings
│   ├── CVBuilder.js            # CV creation tool
│   └── Profile.js              # User profile management
├── api/                 # API service layers
│   ├── userApi.js              # User-related API calls
│   └── jobApi.js               # Job-related API calls
└── utils/               # Helper functions
    └── auth.js                 # Authentication utilities
```

### Backend Structure
```
backend/
├── routes/              # API endpoint definitions
│   ├── auth.js                 # Authentication endpoints
│   ├── admin.js                # Admin management API
│   ├── jobs.js                 # Job management API
│   └── profile.js              # User profile API
├── models/              # Database models and schemas
├── middleware/          # Custom middleware (auth, validation)
├── config/              # Configuration files
└── .env                 # Environment variables
```

## 🔐 Authentication System

### JWT Implementation
- **Secret**: Stored in `.env` as `JWT_SECRET`
- **Expiration**: 24 hours for user tokens
- **Admin Detection**: Role-based access with admin flag
- **Protection**: Middleware validates tokens on protected routes

### User Roles
- **Regular Users**: Job applications, CV building, profile management
- **Employers**: Job posting and application management
- **Admins**: Full platform control via `/admin` dashboard

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with role-based access
- `jobs` - Job postings with employer relationships
- `applications` - Job application tracking
- `testimonials` - User success stories
- `admin_activity_log` - Admin action auditing
- `system_settings` - Platform configuration

### Relationships
- Users → Jobs (one-to-many for employers)
- Users → Applications (one-to-many for applicants)  
- Jobs → Applications (one-to-many)

## 🛠️ Development Guidelines

### Code Style
- **Frontend**: Use functional components with hooks
- **Backend**: Use async/await for database operations
- **Error Handling**: Comprehensive try-catch with proper HTTP status codes
- **API Responses**: Consistent JSON structure with success/error states

### Security Practices
- **Password Hashing**: bcryptjs with salt rounds
- **SQL Injection**: Use parameterized queries
- **CORS**: Configured for frontend-backend communication
- **Environment Variables**: Never commit `.env` files

### Performance Considerations
- **Database**: Connection pooling for MySQL
- **Frontend**: Lazy loading for routes
- **API**: Proper caching headers
- **Build**: Optimized production builds

## 🔧 Development Workflow

### Starting Development
```bash
# From root directory
npm run dev  # Starts both frontend (3002) and backend (5001)
```

### Database Setup
```bash
cd backend
node setup-admin-database.js  # Creates tables and admin user
```

### Environment Configuration
```env
# backend/.env
PORT=5001
JWT_SECRET=startwise_super_secret_jwt_key_2024_admin_system
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=startwise_db
```

## 📋 Common Tasks

### Adding New API Endpoints
1. Create route handler in appropriate `/backend/routes/` file
2. Add middleware for authentication if needed
3. Implement database queries with proper error handling
4. Add corresponding frontend API calls in `/frontend/src/api/`

### Creating New Components
1. Follow existing component patterns in `/frontend/src/components/`
2. Use Tailwind CSS for styling
3. Implement proper props validation
4. Add to appropriate routing if it's a page component

### Database Modifications
1. Update schema in `/backend/models/schema.sql`
2. Create migration script if needed
3. Update model files with new structure
4. Test with development data

## 🚨 Troubleshooting

### Common Issues
- **Port Conflicts**: Use `lsof -ti:3002` and `kill -9 <PID>` to clear ports
- **Database Connection**: Check MySQL service and credentials
- **CORS Errors**: Verify frontend/backend URL configuration
- **Auth Issues**: Check JWT secret consistency between environments

### Admin Access
- **Default Credentials**: admin@startwise.com / admin123
- **Dashboard Route**: `/admin` (requires admin role)
- **API Base**: All admin endpoints at `/api/admin/*`

## 🎯 Project Goals

### Completed Features
- ✅ Complete admin authentication system
- ✅ Full-stack admin dashboard functionality  
- ✅ User profile and job management
- ✅ Production-ready deployment setup

### Future Enhancements
- Advanced search and filtering
- Real-time notifications
- Enhanced CV templates
- Analytics dashboard improvements
- Mobile app development

## 📝 Code Examples

### API Call Pattern
```javascript
// Frontend API call with authentication
const response = await axios.get(`${BASE_URL}/api/admin/dashboard`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### Protected Route Implementation
```javascript
// Component-level protection
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token || !isTokenValid(token)) {
    navigate('/login');
  }
}, []);
```

### Database Query Pattern
```javascript
// Backend database operation
const [rows] = await pool.execute(
  'SELECT * FROM users WHERE role = ?',
  ['admin']
);
```

## 🌟 Best Practices

### Code Organization
- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper error boundaries
- Follow RESTful API conventions

### Performance
- Implement pagination for large datasets
- Use React.memo for expensive components
- Optimize database queries with indexes
- Implement proper caching strategies

### Security
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Regular security audits
