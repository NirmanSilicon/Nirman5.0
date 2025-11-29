const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Simple .env parser
function loadEnv() {
    try {
        const envPath = path.join(__dirname, '..', '.env');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    process.env[key.trim()] = value.trim();
                }
            });
            console.log('Loaded environment variables from .env');
        }
    } catch (e) {
        console.log('Could not load .env file, relying on system environment variables');
    }
}

loadEnv();

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not defined in .env or environment variables');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    const client = await pool.connect();
    try {
        console.log('Connected to database...');

        // Read schema
        const schemaPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running schema...');
        await client.query(schemaSql);
        console.log('Schema applied successfully.');

        // Read seed
        const seedPath = path.join(__dirname, '..', 'src', 'lib', 'db', 'seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Running seed data...');
        await client.query(seedSql);
        console.log('Seed data applied successfully.');

        console.log('\nDatabase setup complete! 🎉');
        console.log('You can now log in with:');
        console.log('College Admin: admin@soa.ac.in / Admin@123');
        console.log('Club Admin: gdg@iter.ac.in / Club@123');

    } catch (err) {
        console.error('Error setting up database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

setup();
