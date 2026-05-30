import { Sequelize } from 'sequelize';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL environment variable is not set');

export const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions:
    process.env.DB_SSL === 'true'
      ? { ssl: { rejectUnauthorized: false } }
      : {},
});
