'use strict';
import { Sequelize } from 'sequelize';

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
  const { User, Token, SocAcc } = await import('../model');

  await User.sync({ alter: true });
  await Token.sync({ alter: true });
  await SocAcc.sync({ alter: true });

  console.log('DB UP');
}

export { client, dbSetup }