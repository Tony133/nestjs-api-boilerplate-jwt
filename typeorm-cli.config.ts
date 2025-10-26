import { DataSource } from 'typeorm';

process.loadEnvFile();

export default new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT
    ? parseInt(process.env.TYPEORM_PORT, 10)
    : 3306,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [],
  migrations: [],
});
