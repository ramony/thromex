import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Detail = sequelize.define('Detail', {
  // 字段定义（自动生成 id、createdAt、updatedAt 字段）
  // 定义字段，例如：
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  detailType: {
    type: DataTypes.STRING, // 字符串类型
    allowNull: false // 不允许为 null
  },
  detailId: {
    type: DataTypes.STRING, // 字符串类型
    allowNull: false // 不允许为 null
  },
  detailTitle: {
    type: DataTypes.STRING, // 字符串类型
    allowNull: false // 不允许为 null
  },
  detailUrl: {
    type: DataTypes.STRING, // 字符串类型
    allowNull: false // 不允许为 null
  },
  readFlag: {
    type: DataTypes.INTEGER, // 字符串类型
    allowNull: false // 不允许为 null
  },
  localFlag: {
    type: DataTypes.INTEGER, // 字符串类型
    allowNull: false // 不允许为 null
  },
  pageNo: {
    type: DataTypes.INTEGER, // 字符串类型
    allowNull: false // 不允许为 null
  },

  createDate: {
    type: DataTypes.DATE, // 字符串类型
    allowNull: false // 不允许为 null
  },
  updateDate: {
    type: DataTypes.DATE, // 字符串类型
    allowNull: false // 不允许为 null
  },
  keyword: {
    type: DataTypes.STRING, // 字符串类型
    allowNull: false // 不允许为 null
  },
  tagId: {
    type: DataTypes.INTEGER, // 字符串类型
    allowNull: false // 不允许为 null
  },
  score: {
    type: DataTypes.INTEGER, // 字符串类型
    allowNull: false // 不允许为 null
  },
  detailOrder: {
    type: DataTypes.BIGINT, // 字符串类型
    allowNull: false // 不允许为 null
  },
});

export default Detail;