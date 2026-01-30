'use strict';
import { Sequelize } from 'sequelize';
import { DBError } from '../errors';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
} = process.env;

const client = new Sequelize({
  database: POSTGRES_DB || 'postgres',
  username: POSTGRES_USER || 'postgres',
  host: POSTGRES_HOST || 'localhost',
  dialect: 'postgres',
  port: Number(POSTGRES_PORT) || 5432,
  password: POSTGRES_PASSWORD || '123',
});

const dbSetup = async () => {
  try {
    const { default: DB } = await import('../model');

    await Promise.all(
      Object.values(DB).map((model) => model.sync({ alter: true })),
    );
  } catch (error) {
    throw new DBError(`Database setup failed: ${error}`)
  }
};

export { client, dbSetup };
