const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load env
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
        }
    } catch (e) { }
}
loadEnv();

// Parse connection string to get base config
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/unixplore';
// We need to connect to 'postgres' db first to create a new db
const baseDbUrl = dbUrl.replace(/\/unixplore$/, '/postgres');

const client = new Client({
    connectionString: baseDbUrl,
});

async function createDatabase() {
    try {
        await client.connect();
        console.log('Connected to postgres database...');

        // Check if db exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'unixplore'");

        if (res.rowCount === 0) {
            console.log('Database unixplore does not exist. Creating...');
            await client.query('CREATE DATABASE unixplore');
            console.log('Database unixplore created successfully!');
        } else {
            console.log('Database unixplore already exists.');
        }

    } catch (err) {
        console.error('Error creating database:', err);
        console.log('Make sure PostgreSQL is running and credentials in .env are correct.');
    } finally {
        await client.end();
    }
}

createDatabase();
