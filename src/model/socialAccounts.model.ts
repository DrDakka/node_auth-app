import { client } from '../db/db';
import { DataTypes } from 'sequelize';
import { TNAMES, fnames } from '../static'

const nms = fnames[TNAMES.SCN]

const SocialAccount = client.define(
  'SocialAccount',
  {
    [nms.id]: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    [nms.usr]: {
      type: DataTypes.UUIDV4,
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
