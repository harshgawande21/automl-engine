import pool from '../database/connection.js';

// Example queries for analyzing the generated user data
const queryExamples = {
    // User demographics and statistics
    async getUserStatistics() {
        const query = `
            SELECT 
                COUNT(*) as total_users,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count,
                COUNT(CASE WHEN role = 'data_scientist' THEN 1 END) as data_scientist_count,
                COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_user_count,
                COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_users,
                COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
                AVG(experience_years) as avg_experience_years,
                MIN(experience_years) as min_experience,
                MAX(experience_years) as max_experience,
                COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 END) as active_last_week,
                COUNT(CASE WHEN last_login > DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as active_last_month
            FROM users
        `;
        
        const [rows] = await pool.query(query);
        return rows[0];
    },

    // Geographic distribution
    async getGeographicDistribution() {
        const query = `
            SELECT 
                country,
                COUNT(*) as user_count,
                ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
            FROM users 
            GROUP BY country 
            ORDER BY user_count DESC 
            LIMIT 20
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Organization and department analysis
    async getOrganizationStats() {
        const query = `
            SELECT 
                organization,
                department,
                COUNT(*) as user_count,
                AVG(experience_years) as avg_experience,
                COUNT(CASE WHEN role = 'data_scientist' THEN 1 END) as data_scientists,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
            FROM users 
            WHERE organization IS NOT NULL
            GROUP BY organization, department
            ORDER BY user_count DESC
            LIMIT 15
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Skills analysis
    async getTopSkills() {
        const query = `
            SELECT 
                skills,
                COUNT(*) as frequency,
                AVG(experience_years) as avg_experience_with_skill
            FROM users 
            WHERE skills IS NOT NULL AND skills != ''
            GROUP BY skills
            ORDER BY frequency DESC
            LIMIT 20
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Education and experience correlation
    async getEducationExperienceStats() {
        const query = `
            SELECT 
                education_level,
                COUNT(*) as user_count,
                AVG(experience_years) as avg_experience,
                MIN(salary_range) as min_salary_range,
                MAX(salary_range) as max_salary_range,
                COUNT(CASE WHEN role = 'data_scientist' THEN 1 END) as data_scientists
            FROM users 
            GROUP BY education_level
            ORDER BY 
                CASE education_level
                    WHEN 'phd' THEN 1
                    WHEN 'master' THEN 2
                    WHEN 'bachelor' THEN 3
                    WHEN 'high_school' THEN 4
                    ELSE 5
                END
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Login activity analysis
    async getLoginActivityStats() {
        const query = `
            SELECT 
                DATE(login_time) as date,
                COUNT(*) as total_logins,
                SUM(CASE WHEN login_status = 'success' THEN 1 ELSE 0 END) as successful_logins,
                SUM(CASE WHEN login_status = 'failed' THEN 1 ELSE 0 END) as failed_logins,
                COUNT(DISTINCT user_id) as unique_users,
                ROUND(SUM(CASE WHEN login_status = 'success' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
            FROM login_history 
            WHERE login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(login_time)
            ORDER BY date DESC
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // User activity patterns
    async getUserActivityPatterns() {
        const query = `
            SELECT 
                activity_type,
                COUNT(*) as activity_count,
                COUNT(DISTINCT user_id) as unique_users,
                AVG(JSON_EXTRACT(activity_data, '$.duration')) as avg_duration_seconds,
                SUM(CASE WHEN JSON_EXTRACT(activity_data, '$.success') = true THEN 1 ELSE 0 END) as successful_activities
            FROM user_activity 
            WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY activity_type
            ORDER BY activity_count DESC
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Most active users
    async getMostActiveUsers() {
        const query = `
            SELECT 
                u.name,
                u.email,
                u.role,
                u.organization,
                COUNT(ua.id) as total_activities,
                COUNT(DISTINCT ua.activity_type) as unique_activity_types,
                MAX(ua.timestamp) as last_activity,
                COUNT(lh.id) as login_count
            FROM users u
            LEFT JOIN user_activity ua ON u.id = ua.user_id
            LEFT JOIN login_history lh ON u.id = lh.user_id AND lh.login_status = 'success'
            GROUP BY u.id, u.name, u.email, u.role, u.organization
            ORDER BY total_activities DESC
            LIMIT 20
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Role-based activity analysis
    async getRoleBasedActivity() {
        const query = `
            SELECT 
                u.role,
                COUNT(DISTINCT u.id) as total_users,
                COUNT(ua.id) as total_activities,
                COUNT(DISTINCT ua.activity_type) as unique_activity_types,
                AVG(CASE WHEN ua.activity_type = 'model_training' THEN 1 ELSE 0 END) * 100 as model_training_percentage,
                AVG(CASE WHEN ua.activity_type = 'dataset_upload' THEN 1 ELSE 0 END) * 100 as dataset_upload_percentage,
                COUNT(lh.id) as total_logins,
                AVG(u.experience_years) as avg_experience
            FROM users u
            LEFT JOIN user_activity ua ON u.id = ua.user_id
            LEFT JOIN login_history lh ON u.id = lh.user_id AND lh.login_status = 'success'
            GROUP BY u.role
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Salary range analysis by role and experience
    async getSalaryAnalysis() {
        const query = `
            SELECT 
                role,
                salary_range,
                COUNT(*) as user_count,
                AVG(experience_years) as avg_experience,
                MIN(experience_years) as min_experience,
                MAX(experience_years) as max_experience,
                education_level
            FROM users 
            WHERE salary_range IS NOT NULL
            GROUP BY role, salary_range, education_level
            ORDER BY 
                CASE role
                    WHEN 'admin' THEN 1
                    WHEN 'data_scientist' THEN 2
                    ELSE 3
                END,
                salary_range
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // Recent registration trends
    async getRegistrationTrends() {
        const query = `
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as new_registrations,
                COUNT(CASE WHEN role = 'admin' THEN 1 END) as new_admins,
                COUNT(CASE WHEN role = 'data_scientist' THEN 1 END) as new_data_scientists,
                COUNT(CASE WHEN role = 'user' THEN 1 END) as new_users,
                COUNT(CASE WHEN email_verified = TRUE THEN 1 END) as verified_registrations
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    },

    // User engagement score calculation
    async getUserEngagementScores() {
        const query = `
            SELECT 
                u.name,
                u.email,
                u.role,
                u.organization,
                -- Login frequency score (0-30 points)
                LEAST(30, COUNT(lh.id) * 2) as login_score,
                -- Activity diversity score (0-25 points)
                LEAST(25, COUNT(DISTINCT ua.activity_type) * 5) as activity_diversity_score,
                -- Recent activity score (0-25 points)
                LEAST(25, 
                    CASE 
                        WHEN MAX(ua.timestamp) >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 25
                        WHEN MAX(ua.timestamp) >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 20
                        WHEN MAX(ua.timestamp) >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 15
                        WHEN MAX(ua.timestamp) >= DATE_SUB(NOW(), INTERVAL 90 DAY) THEN 10
                        ELSE 5
                    END
                ) as recent_activity_score,
                -- Profile completeness score (0-20 points)
                LEAST(20, 
                    (CASE WHEN u.bio IS NOT NULL AND u.bio != '' THEN 5 ELSE 0 END) +
                    (CASE WHEN u.skills IS NOT NULL AND u.skills != '' THEN 5 ELSE 0 END) +
                    (CASE WHEN u.linkedin IS NOT NULL THEN 3 ELSE 0 END) +
                    (CASE WHEN u.github IS NOT NULL THEN 3 ELSE 0 END) +
                    (CASE WHEN u.website IS NOT NULL THEN 2 ELSE 0 END) +
                    (CASE WHEN u.phone IS NOT NULL THEN 2 ELSE 0 END)
                ) as profile_completeness_score
            FROM users u
            LEFT JOIN login_history lh ON u.id = lh.user_id AND lh.login_status = 'success'
            LEFT JOIN user_activity ua ON u.id = ua.user_id
            GROUP BY u.id, u.name, u.email, u.role, u.organization
            HAVING login_score + activity_diversity_score + recent_activity_score + profile_completeness_score > 0
            ORDER BY (login_score + activity_diversity_score + recent_activity_score + profile_completeness_score) DESC
            LIMIT 50
        `;
        
        const [rows] = await pool.query(query);
        return rows;
    }
};

// Function to run all example queries
async function runAllQueries() {
    console.log('📊 Running User Data Analysis Queries...\n');
    
    try {
        // User Statistics
        console.log('👥 User Statistics:');
        const userStats = await queryExamples.getUserStatistics();
        console.log(JSON.stringify(userStats, null, 2));
        console.log('\n' + '='.repeat(50) + '\n');

        // Geographic Distribution
        console.log('🌍 Geographic Distribution (Top 20):');
        const geoDist = await queryExamples.getGeographicDistribution();
        console.table(geoDist);
        console.log('\n' + '='.repeat(50) + '\n');

        // Organization Stats
        console.log('🏢 Organization & Department Stats:');
        const orgStats = await queryExamples.getOrganizationStats();
        console.table(orgStats);
        console.log('\n' + '='.repeat(50) + '\n');

        // Top Skills
        console.log('💻 Top Skills:');
        const topSkills = await queryExamples.getTopSkills();
        console.table(topSkills);
        console.log('\n' + '='.repeat(50) + '\n');

        // Education & Experience
        console.log('🎓 Education & Experience Stats:');
        const eduStats = await queryExamples.getEducationExperienceStats();
        console.table(eduStats);
        console.log('\n' + '='.repeat(50) + '\n');

        // Login Activity
        console.log('🔐 Login Activity (Last 30 Days):');
        const loginStats = await queryExamples.getLoginActivityStats();
        console.table(loginStats);
        console.log('\n' + '='.repeat(50) + '\n');

        // User Activity Patterns
        console.log('📈 User Activity Patterns (Last 30 Days):');
        const activityPatterns = await queryExamples.getUserActivityPatterns();
        console.table(activityPatterns);
        console.log('\n' + '='.repeat(50) + '\n');

        // Most Active Users
        console.log('🏆 Most Active Users:');
        const activeUsers = await queryExamples.getMostActiveUsers();
        console.table(activeUsers);
        console.log('\n' + '='.repeat(50) + '\n');

        // Role-based Activity
        console.log('👔 Role-based Activity Analysis:');
        const roleActivity = await queryExamples.getRoleBasedActivity();
        console.table(roleActivity);
        console.log('\n' + '='.repeat(50) + '\n');

        // Registration Trends
        console.log('📅 Registration Trends (Last 90 Days):');
        const regTrends = await queryExamples.getRegistrationTrends();
        console.table(regTrends);
        console.log('\n' + '='.repeat(50) + '\n');

        // User Engagement Scores
        console.log('⭐ User Engagement Scores (Top 50):');
        const engagementScores = await queryExamples.getUserEngagementScores();
        console.table(engagementScores);
        console.log('\n' + '='.repeat(50) + '\n');

        console.log('✅ All queries completed successfully!');
        
    } catch (error) {
        console.error('❌ Error running queries:', error);
    } finally {
        await pool.end();
    }
}

// Run individual query examples
async function runQueryExample(queryName) {
    if (queryExamples[queryName]) {
        try {
            console.log(`📊 Running ${queryName}...`);
            const result = await queryExamples[queryName]();
            console.table(result);
        } catch (error) {
            console.error(`❌ Error running ${queryName}:`, error);
        } finally {
            await pool.end();
        }
    } else {
        console.log('❌ Query not found. Available queries:');
        console.log(Object.keys(queryExamples).map(q => `  - ${q}`).join('\n'));
    }
}

// Export for use in other modules
export { queryExamples, runAllQueries, runQueryExample };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const queryName = process.argv[2];
    if (queryName) {
        runQueryExample(queryName);
    } else {
        runAllQueries();
    }
}
