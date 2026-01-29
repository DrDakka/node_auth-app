import { client } from '../db/db';
import { DataTypes } from 'sequelize';
import { tnames, fnames, ent } from '../static'

const nms = fnames[ent.soc];

const SocAcc = client.define(
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
        model: tnames[ent.usr],
        key: fnames[ent.usr].id,
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
    tableName: tnames[ent.soc],
    createdAt: false,
    updatedAt: false,
  },
);

export default SocAcc;
