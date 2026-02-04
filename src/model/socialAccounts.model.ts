import { client } from '../db/db.ts';
import { DataTypes } from 'sequelize';
import { TNAMES, fnames } from '../static/index.ts';

const nms = fnames[TNAMES.SCN];

const SocialAccount = client.define(
  'SocialAccount',
  {
    [nms.id]: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    [nms.usr]: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: TNAMES.USR,
        key: fnames[TNAMES.USR].id,
      },
      onDelete: 'CASCADE',
    },
    [nms.ggl]: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    [nms.gh]: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    [nms.fb]: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: TNAMES.SCN,
    createdAt: false,
    updatedAt: false,
  },
);

export default SocialAccount;
