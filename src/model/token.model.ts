import { client } from '../db/db';
import { DataTypes } from 'sequelize';
import { tnames, fnames, ent } from '../static';

const nms = fnames[ent.tkn];

const Token = client.define(
  'Token',
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
        model: tnames[ent.usr],
        key: fnames[ent.usr].id,
      },
      onDelete: 'CASCADE',
    },
    [nms.token]: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    [nms.type]: {
      type: DataTypes.ENUM('activation', 'password_reset', 'refresh'),
      allowNull: false,
    },
    [nms.exp]: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: tnames[ent.tkn],
    createdAt: true,
    updatedAt: false,
  },
);

export default Token;
