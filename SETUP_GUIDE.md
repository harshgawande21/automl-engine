# 🚀 ML Engine - Complete Setup Guide

This guide will help you set up the complete ML Engine with real data processing, EDA capabilities, and automated user data generation.

## 📋 Prerequisites

### Required Software
- **Node.js** 16+ (https://nodejs.org/)
- **MySQL** 8.0+ (https://dev.mysql.com/downloads/mysql/)
- **Git** (https://git-scm.com/)

### System Requirements
- **RAM**: 4GB+ recommended
- **Storage**: 2GB+ free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

---

## 🗄️ Step 1: Database Setup

### 1.1 Install MySQL
```bash
# Windows: Download and run MySQL Installer
# macOS: brew install mysql
# Linux: sudo apt-get install mysql-server
```

### 1.2 Start MySQL Service
```bash
# Windows: Start MySQL service from Services
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

### 1.3 Create Database Connection
Navigate to `backend/database/connection.js` and verify your credentials:

```javascript
const pool = createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",  // Update with your MySQL password
    database: "ml_engine_db"
});
```

---

## 📦 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```bash
cd backend
```

### 2.2 Install Dependencies
```bash
npm install mysql2 bcryptjs @faker-js/faker dotenv
```

### 2.3 Setup Database Schema
```bash
node scripts/setupDatabase.js
```

### 2.4 Generate User Data
```bash
node scripts/generateUserData.js
```

### 2.5 Verify Data Generation
```bash
node scripts/queryExamples.js
```

---

## 🎨 Step 3: Frontend Setup

### 3.1 Navigate to Frontend Directory
```bash
cd frontend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Start Development Server
```bash
npm run dev
```

---

## 🌐 Step 4: Access Your ML Engine

### 4.1 Open Application
- **Frontend**: http://localhost:5173
- **Login**: Use any generated user email with password "password123"

### 4.2 Test Features
1. **Data Upload**: Upload a CSV file
2. **EDA Analysis**: View exploratory data analysis
3. **Model Training**: Train ML models
4. **User Analytics**: Query user data patterns

---

## 📊 What You Get

### 🎯 Complete ML Pipeline
- ✅ **Real CSV Processing**: Upload and analyze actual datasets
- ✅ **EDA Analysis**: Statistical analysis, correlations, outliers
- ✅ **Smart Recommendations**: AI-powered algorithm suggestions
- ✅ **Model Training**: Automated training with realistic results

### 👥 1000+ Realistic Users
- ✅ **Diverse Roles**: Admin, Data Scientist, Regular Users
- ✅ **Rich Profiles**: Skills, experience, education, social profiles
- ✅ **Activity Data**: Login history, platform interactions
- ✅ **Global Reach**: Users from 50+ countries

### 📈 Analytics Ready
- ✅ **User Behavior**: Realistic activity patterns
- ✅ **Engagement Metrics**: Login frequency, feature usage
- ✅ **Performance Data**: Training results and accuracy
- ✅ **Demographics**: User statistics and trends

---

## 🔧 Customization Options

### Modify User Generation
Edit `backend/scripts/generateUserData.js`:

```javascript
const USER_COUNT = 1000;        // Number of users
const BATCH_SIZE = 100;         // Database batch size
const SALT_ROUNDS = 10;         // Password security
```

### Add New Organizations
```javascript
const ORGANIZATIONS = [
    'Your Company Name',
    'Tech Startup Inc',
    // Add more...
];
```

### Customize Skills
```javascript
const SKILLS = [
    'Your Custom Skill',
    'Another Skill',
    // Add more...
];
```

---

## 📝 Sample Test Data

### Create Test CSV
Create a file `test_data.csv`:

```csv
age,income,education,experience,purchased
25,50000,Bachelor,2,No
35,75000,Master,8,Yes
45,90000,PhD,15,Yes
28,60000,Bachelor,4,No
32,70000,Master,6,Yes
```

### Test Login Credentials
After running the data generation script, you can use any of the generated users. Here are some example patterns:

- **Email**: `john.smith@gmail.com`
- **Password**: Check the generated data (or use the forgot password feature)

---

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
❌ Error: Access denied for user 'root'@'localhost'
```
**Solution**: Update your MySQL password in `backend/database/connection.js`

#### Port Already in Use
```bash
❌ Error: Port 5173 is already in use
```
**Solution**: Kill the process or use a different port:
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Module Not Found
```bash
❌ Error: Cannot find module 'mysql2'
```
**Solution**: Install dependencies in the correct directory:
```bash
cd backend && npm install
```

#### Permission Denied
```bash
❌ Error: EACCES: permission denied
```
**Solution**: Run with administrator privileges or fix file permissions

### Database Issues

#### Reset Database
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE IF EXISTS ml_engine_db; CREATE DATABASE ml_engine_db;"

# Re-run setup
npm run seed
```

#### Check Data
```sql
-- Connect to MySQL
mysql -u root -p

-- Use database
USE ml_engine_db;

-- Check users
SELECT COUNT(*) FROM users;

-- Check recent activity
SELECT * FROM user_activity ORDER BY timestamp DESC LIMIT 5;
```

---

## 📊 Query Examples

### User Analytics
```bash
# Run all analytics queries
node backend/scripts/queryExamples.js

# Run specific query
node backend/scripts/queryExamples.js getUserStatistics
```

### Sample Queries
```sql
-- Get active users by role
SELECT role, COUNT(*) FROM users WHERE is_active = TRUE GROUP BY role;

-- Get login trends
SELECT DATE(login_time), COUNT(*) FROM login_history GROUP BY DATE(login_time);

-- Get top skills
SELECT skills, COUNT(*) FROM users GROUP BY skills ORDER BY COUNT(*) DESC;
```

---

## 🚀 Production Deployment

### Environment Variables
Create `.env` file in backend:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ml_engine_db
NODE_ENV=production
```

### Security Considerations
- Change default passwords
- Use environment variables for sensitive data
- Enable HTTPS in production
- Set up proper database permissions
- Regular security updates

---

## 📚 Next Steps

### Explore Features
1. **Upload Your Data**: Test with real CSV files
2. **EDA Analysis**: Explore statistical insights
3. **Train Models**: Experiment with different algorithms
4. **User Analytics**: Analyze user behavior patterns

### Extend Functionality
- Add more data visualization
- Implement real-time collaboration
- Add more ML algorithms
- Create custom dashboards

### Learn More
- Read the backend README for detailed API documentation
- Check the query examples for analytics inspiration
- Explore the generated data for insights

---

## 🎉 You're Ready!

Your ML Engine is now fully operational with:
- ✅ **1000+ realistic users** with complete profiles
- ✅ **Real data processing** and EDA capabilities  
- ✅ **Automated ML pipeline** with smart recommendations
- ✅ **Comprehensive analytics** and user tracking
- ✅ **Professional interface** with modern UI

**Start exploring at http://localhost:5173! 🚀**

---

## 📞 Need Help?

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the error messages carefully
3. Verify all prerequisites are installed
4. Ensure database credentials are correct

**Happy ML Engineering! 🎯**
