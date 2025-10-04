# StudentsPark 🎓

A comprehensive placement review platform for students across colleges. Share and discover real interview experiences, company insights, and placement strategies from students worldwide.

## 🌟 Features

- **Authentic Reviews**: Real placement experiences from students across various colleges
- **AI-Powered Insights**: Company summaries and preparation tips powered by Gemini 2.0
- **Netflix-Style UI**: Modern, engaging interface for browsing placement experiences
- **Comprehensive Analytics**: Detailed breakdowns of interview processes, difficulty levels, and outcomes
- **Secure Authentication**: JWT-based authentication system
- **Real-time Updates**: Live updates when new reviews are added

## 🚀 Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Modern ES6+ JavaScript

### Backend
- Node.js with Express.js
- MongoDB Atlas for database
- JWT for authentication
- Rate limiting and security middleware

### AI Integration
- Google Gemini 2.0 Flash Experimental for intelligent summaries
- Company-specific preparation tips generation
- Smart content analysis

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd StudentsPark-master
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # From root directory, use the startup script
   start-fullstack.bat
   
   # Or manually start both servers
   # Backend (in backend directory)
   npm run dev
   
   # Frontend (in root directory)
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5174
   - Backend API: http://localhost:5000

## 🎯 Platform Highlights

### For Students
- **Multi-College Community**: Connect with students from various colleges and universities
- **Branch-Specific Insights**: Reviews categorized by different engineering and non-engineering branches
- **Alumni Network**: Learn from seniors who have successfully placed in top companies
- **Real CGPA & Experience Data**: Understand what companies expect from different colleges

### AI-Enhanced Experience
- **Smart Company Summaries**: Get AI-generated insights about company hiring patterns
- **Preparation Roadmaps**: Personalized preparation tips based on company requirements
- **Trend Analysis**: Understand changing placement trends across different colleges

## 🏗️ Project Structure

```
StudentsPark/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── services/                # API and authentication services
│   └── main.jsx                 # Application entry point
├── backend/                     # Backend Node.js application
│   ├── controllers/             # API controllers
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Authentication & security
│   └── services/                # AI and external services
└── public/                      # Static assets
```

## 🔐 Authentication

The platform uses secure JWT-based authentication with:
- User registration with college email validation
- Automatic login after successful signup
- Protected routes for authenticated users
- Real-time authentication state management

## 📊 Data Models

### User Model
- Personal information (name, email, roll number)
- Academic details (degree, branch, passing year)
- Authentication credentials

### Review Model
- Company and job details
- Interview process breakdown
- Ratings and difficulty levels
- Detailed experience narratives
- Preparation tips and resources

## 🚀 Deployment

The application is configured for deployment on:
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas

## 🤝 Contributing

We welcome contributions from students across all colleges! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues, suggestions, or contributions, please contact the StudentsPark team.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the student community worldwide**

*Empowering students through shared placement experiences* 🎓✨
