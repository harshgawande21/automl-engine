import bcrypt from 'bcryptjs';
import pool from '../database/connection.js';
import { faker } from '@faker-js/faker';

// Configuration
const USER_COUNT = 1000;
const BATCH_SIZE = 100;
const SALT_ROUNDS = 10;

// Sample data for realistic user generation
const FIRST_NAMES = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth',
    'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen',
    'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra',
    'Donald', 'Donna', 'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
    'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah', 'Edward', 'Dorothy',
    'Ronald', 'Lisa', 'Timothy', 'Nancy', 'Jason', 'Karen', 'Jeffrey', 'Betty', 'Ryan', 'Helen'
];

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner',
    'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris', 'Rogers'
];

const ORGANIZATIONS = [
    'TechCorp Solutions', 'DataScience Inc', 'AI Innovations Lab', 'Machine Learning Co', 
    'Analytics Pro', 'Neural Networks Ltd', 'BigData Systems', 'Cloud Computing Inc',
    'DevOps Solutions', 'CyberSecurity Pro', 'Mobile Tech Co', 'Web Development Ltd',
    'Software Engineering Inc', 'IT Consulting Group', 'Digital Transformation Co',
    'Startup Accelerator', 'Venture Capital Tech', 'Research Institute', 'University Tech Lab',
    'Government Agency', 'Healthcare Analytics', 'Financial Services Tech', 'E-commerce Platform'
];

const DEPARTMENTS = [
    'Data Science', 'Machine Learning', 'Software Engineering', 'Research & Development',
    'Analytics', 'IT Infrastructure', 'Cybersecurity', 'Cloud Computing',
    'Product Development', 'Business Intelligence', 'Data Engineering', 'AI Research',
    'Quality Assurance', 'DevOps', 'Mobile Development', 'Web Development',
    'Database Administration', 'Network Engineering', 'System Administration', 'Technical Support'
];

const JOB_TITLES = [
    'Data Scientist', 'Machine Learning Engineer', 'Data Analyst', 'Software Engineer',
    'Research Scientist', 'AI Engineer', 'Data Engineer', 'Full Stack Developer',
    'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Cloud Engineer',
    'Cybersecurity Analyst', 'Database Administrator', 'System Administrator',
    'Technical Lead', 'Project Manager', 'Product Manager', 'Business Analyst',
    'QA Engineer', 'Mobile Developer', 'Web Developer', 'Network Engineer'
];

const SKILLS = [
    'Python', 'R', 'SQL', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'TensorFlow',
    'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Tableau', 'Power BI',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'Linux',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Kafka', 'Spark', 'Hadoop'
];

const COUNTRIES = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
    'Belgium', 'Ireland', 'Spain', 'Italy', 'Portugal', 'Poland', 'Czech Republic',
    'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Turkey', 'Israel', 'UAE', 'India',
    'Singapore', 'Japan', 'South Korea', 'China', 'Hong Kong', 'Taiwan', 'Malaysia',
    'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'New Zealand', 'South Africa',
    'Brazil', 'Argentina', 'Mexico', 'Chile', 'Colombia', 'Peru'
];

// Utility functions
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomElements(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function generateRandomDate(startYear = 1970, endYear = 2005) {
    const start = new Date(startYear, 0, 1);
    const end = new Date(endYear, 11, 31);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomSkills() {
    const skillCount = Math.floor(Math.random() * 8) + 3; // 3-10 skills
    return getRandomElements(SKILLS, skillCount).join(', ');
}

function generateEmail(firstName, lastName, domain = null) {
    const domains = domain ? [domain] : [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'company.com', 'techcorp.com', 'datalab.com', 'mlinc.com'
    ];
    const domainChoice = getRandomElement(domains);
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    
    const patterns = [
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domainChoice}`,
        `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domainChoice}`,
        `${firstName.toLowerCase()}_${lastName.toLowerCase()}@${domainChoice}`,
        `${firstName.toLowerCase()}${randomNum}@${domainChoice}`,
        `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNum}@${domainChoice}`
    ];
    
    return getRandomElement(patterns);
}

function generatePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

async function generateUser() {
    const firstName = getRandomElement(FIRST_NAMES);
    const lastName = getRandomElement(LAST_NAMES);
    const email = generateEmail(firstName, lastName);
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    const roleDistribution = [
        { role: 'user', weight: 70 },
        { role: 'data_scientist', weight: 25 },
        { role: 'admin', weight: 5 }
    ];
    
    const role = roleDistribution.reduce((acc, curr) => {
        return Math.random() * 100 < curr.weight ? curr.role : acc;
    }, 'user');
    
    const organization = getRandomElement(ORGANIZATIONS);
    const department = getRandomElement(DEPARTMENTS);
    const jobTitle = getRandomElement(JOB_TITLES);
    const country = getRandomElement(COUNTRIES);
    const birthDate = generateRandomDate();
    const gender = getRandomElement(['male', 'female', 'other', 'prefer_not_to_say']);
    const educationLevel = getRandomElement(['high_school', 'bachelor', 'master', 'phd', 'other']);
    const experienceYears = Math.floor(Math.random() * 20) + 1;
    const salaryRanges = [
        '$30,000 - $50,000', '$50,000 - $70,000', '$70,000 - $90,000',
        '$90,000 - $120,000', '$120,000 - $150,000', '$150,000+'
    ];
    const salaryRange = getRandomElement(salaryRanges);
    
    // Generate address
    const address = faker.address.streetAddress();
    const city = faker.address.city();
    const zipCode = faker.address.zipCode();
    
    // Generate social profiles
    const website = Math.random() > 0.7 ? `https://${firstName.toLowerCase()}.${lastName.toLowerCase()}.com` : null;
    const linkedin = Math.random() > 0.5 ? `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}` : null;
    const github = Math.random() > 0.6 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null;
    
    // Generate bio
    const bioTemplates = [
        `Passionate ${role} with ${experienceYears} years of experience in ${department}. Specialized in data analysis and machine learning.`,
        `Experienced professional working at ${organization}. Expertise in ${getRandomElements(SKILLS, 3).join(', ')}.`,
        `${jobTitle} focused on innovative solutions in data science and AI. Love working with cutting-edge technologies.`,
        `Results-driven ${role} with strong background in ${department}. Committed to delivering high-quality solutions.`,
        `Tech enthusiast with expertise in ${getRandomElements(SKILLS, 4).join(', ')}. Always learning and exploring new technologies.`
    ];
    const bio = getRandomElement(bioTemplates);
    
    return {
        name: `${firstName} ${lastName}`,
        email,
        password_hash: passwordHash,
        role,
        organization,
        department,
        phone: faker.phone.number(),
        address,
        city,
        country,
        zip_code: zipCode,
        birth_date: birthDate.toISOString().split('T')[0],
        gender,
        bio,
        website,
        linkedin,
        github,
        skills: generateRandomSkills(),
        experience_years: experienceYears,
        education_level: educationLevel,
        salary_range: salaryRange,
        job_title: jobTitle,
        email_verified: Math.random() > 0.3, // 70% verified
        is_active: Math.random() > 0.05, // 95% active
        created_at: faker.date.past({ years: 2 }),
        last_login: Math.random() > 0.3 ? faker.date.recent({ days: 30 }) : null
    };
}

async function insertUsers(users) {
    const connection = await pool.getConnection();
    try {
        const placeholders = users.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
        const values = users.flatMap(user => [
            user.name, user.email, user.password_hash, user.role, user.organization,
            user.department, user.phone, user.address, user.city, user.country,
            user.zip_code, user.birth_date, user.gender, user.bio, user.website,
            user.linkedin, user.github, user.skills, user.experience_years,
            user.education_level, user.salary_range, user.job_title,
            user.email_verified, user.is_active, user.created_at, user.last_login
        ]);
        
        const query = `
            INSERT INTO users (
                name, email, password_hash, role, organization, department, phone,
                address, city, country, zip_code, birth_date, gender, bio, website,
                linkedin, github, skills, experience_years, education_level,
                salary_range, job_title, email_verified, is_active, created_at, last_login
            ) VALUES ${placeholders}
        `;
        
        await connection.query(query, values);
        console.log(`✅ Inserted ${users.length} users successfully`);
    } catch (error) {
        console.error('❌ Error inserting users:', error);
        throw error;
    } finally {
        connection.release();
    }
}

async function generateLoginHistory(userId, user) {
    const connection = await pool.getConnection();
    try {
        const loginCount = Math.floor(Math.random() * 50) + 1; // 1-50 logins
        const logins = [];
        
        for (let i = 0; i < loginCount; i++) {
            const loginTime = faker.date.between({
                from: user.created_at,
                to: new Date()
            });
            
            const status = Math.random() > 0.1 ? 'success' : 'failed';
            const failureReason = status === 'failed' ? getRandomElement([
                'Invalid password', 'Account locked', 'Invalid email', 'Account suspended'
            ]) : null;
            
            logins.push([
                userId,
                loginTime,
                faker.internet.ip(),
                faker.internet.userAgent(),
                status,
                failureReason
            ]);
        }
        
        if (logins.length > 0) {
            const placeholders = logins.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
            const values = logins.flat();
            
            const query = `
                INSERT INTO login_history (
                    user_id, login_time, ip_address, user_agent, login_status, failure_reason
                ) VALUES ${placeholders}
            `;
            
            await connection.query(query, values);
        }
    } catch (error) {
        console.error('❌ Error generating login history:', error);
    } finally {
        connection.release();
    }
}

async function generateUserActivity(userId, user) {
    const connection = await pool.getConnection();
    try {
        const activities = [
            'dataset_upload', 'model_training', 'data_analysis', 'profile_update',
            'login', 'logout', 'view_dashboard', 'export_results', 'share_model',
            'delete_dataset', 'update_settings', 'view_tutorial'
        ];
        
        const activityCount = Math.floor(Math.random() * 30) + 5; // 5-35 activities
        const userActivities = [];
        
        for (let i = 0; i < activityCount; i++) {
            const activityTime = faker.date.between({
                from: user.created_at,
                to: new Date()
            });
            
            const activityType = getRandomElement(activities);
            const activityData = {
                details: `User performed ${activityType}`,
                duration: Math.floor(Math.random() * 3600) + 60, // 1-3600 seconds
                success: Math.random() > 0.1
            };
            
            userActivities.push([
                userId,
                activityType,
                JSON.stringify(activityData),
                activityTime,
                faker.internet.ip()
            ]);
        }
        
        if (userActivities.length > 0) {
            const placeholders = userActivities.map(() => '(?, ?, ?, ?, ?)').join(', ');
            const values = userActivities.flat();
            
            const query = `
                INSERT INTO user_activity (
                    user_id, activity_type, activity_data, timestamp, ip_address
                ) VALUES ${placeholders}
            `;
            
            await connection.query(query, values);
        }
    } catch (error) {
        console.error('❌ Error generating user activity:', error);
    } finally {
        connection.release();
    }
}

async function main() {
    console.log('🚀 Starting user data generation...');
    console.log(`📊 Target: ${USER_COUNT} users`);
    
    try {
        // Clear existing data
        console.log('🧹 Clearing existing data...');
        const connection = await pool.getConnection();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE user_activity');
        await connection.query('TRUNCATE TABLE login_history');
        await connection.query('TRUNCATE TABLE user_sessions');
        await connection.query('TRUNCATE TABLE model_training');
        await connection.query('TRUNCATE TABLE dataset_uploads');
        await connection.query('TRUNCATE TABLE users');
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        connection.release();
        console.log('✅ Existing data cleared');
        
        // Generate users in batches
        const totalUsers = [];
        for (let i = 0; i < USER_COUNT; i++) {
            const user = await generateUser();
            totalUsers.push(user);
            
            // Insert in batches
            if (totalUsers.length === BATCH_SIZE || i === USER_COUNT - 1) {
                await insertUsers(totalUsers);
                
                // Get inserted user IDs for activity generation
                const insertedUsers = await pool.query(
                    'SELECT id, created_at FROM users ORDER BY id DESC LIMIT ?',
                    [totalUsers.length]
                );
                
                // Generate additional data for each user
                for (const [index, insertedUser] of insertedUsers[0].entries()) {
                    const originalUser = totalUsers[totalUsers.length - 1 - index];
                    await generateLoginHistory(insertedUser.id, originalUser);
                    await generateUserActivity(insertedUser.id, originalUser);
                }
                
                totalUsers.length = 0; // Clear batch
                console.log(`📈 Progress: ${Math.min((i + 1), USER_COUNT)}/${USER_COUNT} users completed`);
            }
        }
        
        // Generate summary statistics
        const stats = await pool.query(`
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
                COUNT(CASE WHEN role = 'data_scientist' THEN 1 END) as data_scientist_count,
                COUNT(CASE WHEN role = 'user' THEN 1 END) as user_count,
                COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_count,
                COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_count,
                AVG(experience_years) as avg_experience
            FROM users
        `);
        
        console.log('\n📊 Generation Complete! Summary Statistics:');
        console.log(`Total Users: ${stats[0][0].total_users}`);
        console.log(`Admins: ${stats[0][0].admin_count}`);
        console.log(`Data Scientists: ${stats[0][0].data_scientist_count}`);
        console.log(`Regular Users: ${stats[0][0].user_count}`);
        console.log(`Verified Emails: ${stats[0][0].verified_count}`);
        console.log(`Active Users: ${stats[0][0].active_count}`);
        console.log(`Average Experience: ${stats[0][0].avg_experience?.toFixed(1)} years`);
        
        console.log('\n🎉 User data generation completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during data generation:', error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { generateUser, generateLoginHistory, generateUserActivity };
