const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
    const targetDbName = 'unixplore';
    const connectionString = process.env.DATABASE_URL;

    let clientConfig;
    if (connectionString) {
        clientConfig = { connectionString };
    } else {
        clientConfig = {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'krrish601',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: targetDbName
        };
    }

    console.log(`Attempting to connect to database '${targetDbName}'...`);
    const client = new Client(clientConfig);

    try {
        await client.connect();
        console.log(`Connected to '${targetDbName}' successfully.`);
    } catch (err) {
        if (err.code === '3D000') { // Database does not exist
            console.log(`Database '${targetDbName}' does not exist. Attempting to create it...`);
            await createDatabase(targetDbName, connectionString);
            // Reconnect
            // We need to create a new client because the previous one might be in error state
            const newClient = new Client(clientConfig);
            await newClient.connect();
            await runMigrations(newClient);
            await newClient.end();
            return;
        } else {
            console.error('Failed to connect:', err);
            process.exit(1);
        }
    }

    // If connection was successful initially
    await runMigrations(client);
    await client.end();
}

async function runMigrations(client) {
    try {
        // Apply Schema
        const schemaPath = path.join(__dirname, '../src/lib/db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        console.log('Applying schema...');
        await client.query(schemaSql);
        console.log('Schema applied.');

        // Apply Seed
        const seedPath = path.join(__dirname, '../src/lib/db/seed.sql');
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        console.log('Seeding database...');
        await client.query(seedSql);
        console.log('Seeding complete.');

    } catch (err) {
        console.error('Error applying schema/seed:', err);
        // Don't exit process here, just log error
    }
}

async function createDatabase(dbName, originalConnString) {
    // Connect to 'postgres' db
    let config;
    if (originalConnString) {
        // Replace db name in connection string
        // This is a bit hacky but works for standard URLs
        const lastSlash = originalConnString.lastIndexOf('/');
        // Assuming the part after last slash is the db name
        // We replace it with 'postgres'
        config = { connectionString: originalConnString.substring(0, lastSlash) + '/postgres' };
    } else {
        config = {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'krrish601',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            database: 'postgres'
        };
    }

    const client = new Client(config);
    try {
        await client.connect();
        // Check if DB exists again to be safe
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database '${dbName}' created.`);
        } else {
            console.log(`Database '${dbName}' already exists (checked via postgres db).`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        throw err;
    } finally {
        await client.end();
    }
}

initDb();
