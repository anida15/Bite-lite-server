import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
    
 
const sequelize = new Sequelize({
  dialect: (process.env.DB_DIALECT as any) || "sqlite",
  storage: process.env.DB_STORAGE || "./database.sqlite", 
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
