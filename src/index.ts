import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { JwtPayload } from "jsonwebtoken";
import sequelize from "./config/database";
import products from "./routes/products";
import categories from "./routes/categories";
import sales from "./routes/sales";

// import Product from "./models/Product";
// import Category from "./models/Category";
// import Sale from "./models/Sale";
 

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const HOST = process.env.HOST || "localhost";

 
const allowedOrigins = process.env.ALLOW_ORIGINS
  ? process.env.ALLOW_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
};

 
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
});

const healthCheckLimiter = rateLimit({
  windowMs: 10 * 1000,
  limit: 3,
  message: {
    status: 429,
    error: "Too many health checks. Please slow down.",
  },
});

app.use(globalLimiter);
app.use(cors());
app.use(express.json());

 
app.use("/products", products);
app.use("/categories", categories);
app.use("/sales", sales);
 
sequelize
  .authenticate()
  .then(async () => {
    console.log("Connection has been established successfully.");
    // await Category.sync( { alter: true });
    // await Product.sync( { alter: true });
  
    // await Sale.sync( { alter: true });
    app.listen(Number(PORT), HOST, () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("Unable to connect to the database:", err as Error);
  });
