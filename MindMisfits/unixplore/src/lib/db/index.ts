import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
    console.error('Unexpected database pool error:', err);
});

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        // Return a mock empty result instead of throwing to prevent crashes
        if ((error as any).code === 'ECONNREFUSED' || (error as any).code === 'ENOTFOUND') {
            console.warn('Database connection unavailable. Returning empty result.');
            return { rows: [], rowCount: 0, command: '', oid: 0, fields: [] };
        }
        throw error;
    }
};

export const getClient = async () => {
    try {
        const client = await pool.connect();
        const query = client.query.bind(client);
        const release = client.release.bind(client);

        // Set a timeout of 5 seconds
        const timeout = setTimeout(() => {
            console.error('A client has been checked out for more than 5 seconds!');
        }, 5000);

        // Monkey patch the release method to clear timeout and forward arguments
        client.release = (err?: boolean | Error) => {
            clearTimeout(timeout);
            return release(err);
        };

        return client;
    } catch (error) {
        console.error('Failed to get database client:', error);
        throw error;
    }
};

export default pool;