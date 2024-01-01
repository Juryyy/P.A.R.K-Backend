import { config } from 'dotenv';
import { Client } from 'pg';
import { resolve } from 'path';

config({ path: resolve(__dirname, '.env') });

console.log(process.env.DATABASE_URL);

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

// rest of your code
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .then(() => client.query('SELECT NOW()'))
  .then(results => console.log(results.rows))
  .catch(err => console.error('Connection error', err.stack))
  .finally(() => client.end());