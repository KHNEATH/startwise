# StartWise - Career Platform for Startups

A comprehensive career platform designed for startups, providing job listings, CV building, user profiles, and admin management features.

## 🚀 Features

- **Job Board**: Browse and apply for startup jobs
- **CV Builder**: Create professional CVs with templates
- **User Profiles**: Manage personal and professional information
- **Admin Dashboard**: Complete admin management system
- **Authentication**: Secure JWT-based login system
- **Responsive Design**: Mobile-friendly interface
- **Multi-language Support**: Built with i18n support

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **i18next** for internationalization

### Backend
- **Node.js** with Express
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **dotenv** for environment management
- **nodemon** for development

## 📁 Project Structure

```
startwise/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── api/        # API service functions
│   │   ├── utils/      # Utility functions
│   │   └── assets/     # Static assets
│   └── public/         # Public files
├── backend/            # Node.js backend API
│   ├── routes/         # API route handlers
│   ├── models/         # Database models
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   └── .env           # Environment variables
└── Flow/              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repository-url>
cd startwise
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **Set up environment variables**

Create a `.env` file in the backend directory:
```env
PORT=5001
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=startwise_db
DB_PORT=3306
```

4. **Set up the database**
```bash
cd backend
node setup-admin-database.js
```

5. **Start the development servers**
```bash
# From the root directory
npm run dev
```

This will start:
- Frontend on http://localhost:3002
- Backend on http://localhost:5001

## 👑 Admin Access

### Default Admin Credentials
- **Email**: `admin@startwise.com`
- **Password**: `admin123`

### Admin Features
- **Dashboard**: Platform statistics and analytics
- **User Management**: View, edit, suspend users
- **Job Management**: Control job postings
- **Application Tracking**: Monitor job applications
- **System Settings**: Platform configuration

## 📱 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend in development mode
- `npm run start` - Start both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all packages

### Frontend
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

### Backend
- `npm start` - Start Express server
- `npm run dev` - Start with nodemon for development

## 🔐 Authentication

The platform uses JWT-based authentication with role-based access control:
- **Users**: Can create profiles, apply for jobs, build CVs
- **Employers**: Can post jobs and manage applications
- **Admins**: Full platform management access

## 📊 Database Schema

The platform uses MySQL with the following main tables:
- `users` - User accounts and profiles
- `jobs` - Job postings
- `applications` - Job applications
- `testimonials` - User testimonials
- `admin_activity_log` - Admin action logging
- `system_settings` - Platform configuration

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset

### Jobs
- `GET /api/jobs/browse` - Browse jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employers)

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/users` - User management
- `GET /api/admin/jobs` - Job management

## 🚀 Deployment

### Recommended Deployment Options

#### Option 1: Vercel (Frontend) + Railway (Backend)
- **Frontend**: Deploy React app to Vercel
- **Backend**: Deploy Node.js API to Railway with MySQL
- **Benefits**: Easy setup, automatic deployments, good performance

#### Option 2: Netlify (Frontend) + Heroku (Backend)
- **Frontend**: Deploy React build to Netlify
- **Backend**: Deploy to Heroku with ClearDB MySQL addon
- **Benefits**: Free tiers available, simple configuration

### Quick Deployment Steps

1. **Build frontend**:
```bash
cd frontend
npm run build
```

2. **Set up environment variables** for production
3. **Deploy backend** to your chosen platform
4. **Deploy frontend** with correct API URL
5. **Set up database** and run migrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support, please contact the development team or create an issue in the repository.

---

**StartWise** - Empowering startup careers! 🚀
