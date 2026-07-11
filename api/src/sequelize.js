import { Sequelize, DataTypes, Op } from 'sequelize';
import mysql2 from 'mysql2';

// 初始化连接
const host = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize('throme', 'testuser', 'testpass', {
  host: host,
  port: 3306,
  dialect: 'mysql', // 指定数据库类型,=
  dialectModule: mysql2,
  logging: false, // 禁用 SQL 日志
  define: {
    underscored: true,          // 自动将驼峰转为蛇形（用于表名和字段名）
    underscoredAll: true,       // 所有字段名强制使用蛇形
    createdAt: 'create_date',    // 自定义时间戳字段名
    updatedAt: 'update_date',
  },
});

export default sequelize;