# 🚀 Quick Start Guide - India Carbon Registry

## Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- Gmail account (for email verification)

## Setup Steps

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```
MONGODB_URI=mongodb://localhost:27017/carbon-registry
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Note:** For Gmail, use an [App-Specific Password](https://support.google.com/accounts/answer/185833)

### 2. Frontend Setup

```bash
npm install
```

Create `.env.local` file in root directory:
```
VITE_API_URL=http://localhost:5000
```

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows (as Administrator)
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Get connection string and update `MONGODB_URI` in `.env`

### 4. Seed Demo Data

```bash
cd backend
npm run seed
```

This creates demo users and projects.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Demo Credentials

- **Email:** demo@carbonregistry.gov.in
- **Password:** demo123
- **Role:** Administrator

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongosh` or `mongo`
- Verify `.env` file exists with correct values
- Check port 5000 is not in use

### Frontend shows API errors
- Ensure backend is running on port 5000
- Check `.env.local` has correct `VITE_API_URL`
- Clear browser cache and reload

### Email verification not working
- Gmail credentials must be correct
- Use App-Specific Password, not regular password
- Check spam folder

### Demo login fails
- Run `npm run seed` again to reset demo users
- Or click "Reset Demo User" button on login page

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get user's projects (protected)
- `POST /api/projects` - Create new project (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)
- `GET /api/dashboard/recent-projects` - Get recent projects (protected)

## Build for Production

```bash
# Frontend
npm run build

# Backend
NODE_ENV=production npm start
```

## Security Notes

- Change `JWT_SECRET` in production
- Use environment variables for all secrets
- Enable HTTPS in production
- Set proper CORS origins
- Use strong passwords

## Support

For issues or questions, check:
1. Backend logs in terminal
2. Browser console (F12)
3. MongoDB connection status
4. Email configuration

---

**Happy coding! 🌱**
