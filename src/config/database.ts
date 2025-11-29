import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config();

// Neon serverless SQL client (for direct queries if needed)
export const sql = neon(process.env.DATABASE_URL || "");

// Sequelize configuration for Neon (PostgreSQL)
const sequelize = new Sequelize(process.env.DATABASE_URL || "", {
  dialect: "postgres",
  dialectModule: require("pg"),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

export default sequelize;
