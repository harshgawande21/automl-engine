# ML Engine Backend - Automated User Data Generation

This backend system provides comprehensive user data generation for the ML Engine platform, including realistic user profiles, login history, and activity tracking.

## 🚀 Features

### 📊 Automated Data Generation
- **1000+ Realistic Users**: Complete user profiles with personal and professional information
- **Diverse Roles**: Admin, Data Scientist, and Regular User roles with realistic distribution
- **Rich Profiles**: Skills, experience, education, social profiles, and bio information
- **Global Reach**: Users from 50+ countries with realistic addresses and demographics

### 🔐 Authentication Data
- **Secure Passwords**: Bcrypt-hashed passwords with proper salt rounds
- **Login History**: Realistic login patterns with success/failure tracking
- **Session Management**: User session data with expiration tracking
- **Activity Logging**: Comprehensive user activity tracking

### 📈 Analytics Ready
- **User Activity**: Dataset uploads, model training, and platform interactions
- **Engagement Metrics**: Login frequency, feature usage, and time-based analytics
- **Performance Data**: Training results and accuracy metrics
- **Behavioral Patterns**: Realistic user behavior simulation

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ 
- MySQL 8.0+
- npm or yarn

### 1. Database Configuration
Update your database connection in `backend/database/connection.js`:

```javascript
const pool = createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "ml_engine_db"
});
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Setup Database
```bash
npm run setup-db
```

### 4. Generate User Data
```bash
npm run generate-users
```

### 5. Complete Setup (All-in-One)
```bash
npm run seed
```

## 📊 Database Schema

### Users Table
```sql
- Personal Information: name, email, birth_date, gender, address
- Professional Details: organization, department, job_title, experience_years
- Skills & Education: skills, education_level, salary_range
- Social Profiles: website, linkedin, github, bio
- Authentication: password_hash, role, email_verified, is_active
- Timestamps: created_at, updated_at, last_login
```

### Activity Tracking Tables
- **user_sessions**: Active user sessions and tokens
- **login_history**: Login attempts with IP tracking and failure reasons
- **user_activity**: Platform interactions and feature usage
- **dataset_uploads**: File upload history and processing status
- **model_training**: ML model training records and results

## 🎯 Data Generation Details

### User Distribution
- **Regular Users**: 70% (700 users)
- **Data Scientists**: 25% (250 users)  
- **Admins**: 5% (50 users)

### Realistic Features
- **Email Addresses**: Professional and personal email patterns
- **Organizations**: Tech companies, research institutes, universities
- **Skills**: 50+ relevant technical skills (Python, ML, Cloud, etc.)
- **Experience**: 1-20 years of experience with realistic distribution
- **Global Presence**: Users from 50+ countries
- **Activity Patterns**: Realistic login frequency and feature usage

### Password Security
- **Strong Passwords**: 12-character random passwords
- **Bcrypt Hashing**: Proper salt rounds (10) for security
- **Email Verification**: 70% of users have verified emails
- **Account Status**: 95% of accounts are active

## 📈 Generated Statistics

### Example Output
```
📊 Generation Complete! Summary Statistics:
Total Users: 1000
Admins: 50
Data Scientists: 250
Regular Users: 700
Verified Emails: 700
Active Users: 950
Average Experience: 8.5 years
```

### Activity Data
- **Login History**: 1-50 logins per user with realistic patterns
- **User Activities**: 5-35 activities per user including:
  - Dataset uploads and processing
  - Model training and evaluation
  - Profile updates and settings changes
  - Dashboard views and exports

## 🔧 Configuration Options

### Customization
Edit `backend/scripts/generateUserData.js` to modify:

```javascript
const USER_COUNT = 1000;           // Number of users to generate
const BATCH_SIZE = 100;            // Batch size for database inserts
const SALT_ROUNDS = 10;            // Bcrypt salt rounds
```

### Adding New Data
- **New Organizations**: Add to `ORGANIZATIONS` array
- **New Skills**: Add to `SKILLS` array  
- **New Countries**: Add to `COUNTRIES` array
- **New Job Titles**: Add to `JOB_TITLES` array

## 🚀 Usage Examples

### Querying User Data
```sql
-- Get active users by role
SELECT role, COUNT(*) as count 
FROM users 
WHERE is_active = TRUE 
GROUP BY role;

-- Get top skills
SELECT skills, COUNT(*) as frequency 
FROM users 
WHERE skills IS NOT NULL 
GROUP BY skills 
ORDER BY frequency DESC;

-- Get login statistics
SELECT 
    DATE(login_time) as date,
    COUNT(*) as logins,
    SUM(CASE WHEN login_status = 'success' THEN 1 ELSE 0 END) as successful_logins
FROM login_history 
GROUP BY DATE(login_time)
ORDER BY date DESC;
```

### Analytics Queries
```sql
-- User engagement by department
SELECT 
    department,
    COUNT(*) as user_count,
    AVG(experience_years) as avg_experience,
    COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_last_week
FROM users 
GROUP BY department;

-- Training activity by role
SELECT 
    u.role,
    COUNT(mt.id) as models_trained,
    AVG(mt.accuracy) as avg_accuracy
FROM users u
LEFT JOIN model_training mt ON u.id = mt.user_id
GROUP BY u.role;
```

## 🔍 Data Quality Features

### Realistic Patterns
- **Login Frequency**: Users login 1-50 times with realistic distribution
- **Activity Timing**: Activities spread across user's lifetime
- **Skill Distribution**: Relevant technical skills for ML/data science roles
- **Geographic Distribution**: Global user base with realistic country distribution

### Data Integrity
- **Foreign Key Constraints**: Proper relationships between tables
- **Unique Constraints**: No duplicate emails or session tokens
- **Data Validation**: Proper data types and constraints
- **Timestamp Consistency**: Logical chronological ordering

## 🛡️ Security Features

### Password Security
- **Bcrypt Hashing**: Industry-standard password hashing
- **Strong Passwords**: 12-character random passwords
- **Salt Rounds**: Proper configuration (10 rounds)

### Data Protection
- **No Real PII**: All generated data is fictional
- **Secure Defaults**: Appropriate default security settings
- **Access Control**: Role-based access structure

## 📝 Scripts Reference

### Available Scripts
```bash
npm run setup-db      # Create database and tables
npm run generate-users # Generate user data
npm run seed          # Complete setup and data generation
npm run dev           # Development mode with nodemon
npm run start         # Production mode
```

### Manual Execution
```bash
node scripts/setupDatabase.js      # Setup database
node scripts/generateUserData.js   # Generate users
```

## 🎉 Benefits

### For Development
- **Realistic Testing**: Test your application with realistic user data
- **Performance Testing**: Load testing with substantial dataset
- **Feature Development**: Develop features with comprehensive data
- **Analytics Development**: Build analytics with meaningful data

### For Analytics
- **User Behavior**: Realistic user activity patterns
- **Engagement Metrics**: Meaningful engagement statistics
- **Performance Data**: Training results and accuracy metrics
- **Demographic Insights**: User demographics and preferences

## 🔄 Maintenance

### Regenerating Data
```bash
# Clear and regenerate all data
npm run seed

# Add more users (edit USER_COUNT first)
npm run generate-users
```

### Backup Data
```bash
# Export database
mysqldump -u root -p ml_engine_db > backup.sql

# Import database
mysql -u root -p ml_engine_db < backup.sql
```

---

**🎉 Your ML Engine now has a comprehensive user database with 1000+ realistic users, complete with authentication data, activity tracking, and analytics-ready information!**
