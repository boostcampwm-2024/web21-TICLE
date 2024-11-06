// config/database.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('database', async () => ({
  type: process.env.DATABASE_TYPE || 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME || 'myusername1',
  password: process.env.DATABASE_PASSWORD || 'mypassword',
  name: process.env.DATABASE_NAME || 'mydatabases',
}));
