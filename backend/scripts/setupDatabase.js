import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
    console.log('🔧 Setting up database...');
    
    try {
        const connection = await pool.getConnection();
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Executing ${statements.length} SQL statements...`);
        
        for (const statement of statements) {
            try {
                await connection.query(statement);
            } catch (error) {
                // Ignore errors for CREATE DATABASE IF NOT EXISTS
                if (!statement.includes('CREATE DATABASE')) {
                    console.error(`❌ Error executing statement: ${statement.substring(0, 50)}...`);
                    console.error(error.message);
                }
            }
        }
        
        console.log('✅ Database setup completed successfully!');
        console.log('📊 Database: ml_engine_db');
        console.log('📋 Tables created: users, user_sessions, login_history, user_activity, dataset_uploads, model_training');
        
        connection.release();
        
    } catch (error) {
        console.error('❌ Error setting up database:', error);
        throw error;
    }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    setupDatabase()
        .then(() => {
            console.log('🎉 Database is ready for user data generation!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Database setup failed:', error);
            process.exit(1);
        });
}

export default setupDatabase;
