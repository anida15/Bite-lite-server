# Bite Lite Server

A RESTful API server built with Node.js, Express, and TypeScript for managing products, categories, and sales data.

## 🚀 Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime environment
- **Express.js** (v5.1.0) - Web application framework
- **TypeScript** (v5.9.3) - Typed superset of JavaScript
- **ts-node** - TypeScript execution engine for Node.js

### Database & ORM
- **PostgreSQL** (via Neon) - Serverless PostgreSQL database
- **Sequelize** (v6.37.7) - SQL ORM for Node.js
- **@neondatabase/serverless** - Neon serverless driver
- **pg** - PostgreSQL client for Node.js

### Validation & Security
- **Zod** (v4.1.13) - TypeScript-first schema validation
- **jsonwebtoken** (v9.0.2) - JWT authentication
- **express-rate-limit** (v8.2.1) - Rate limiting middleware
- **cors** (v2.8.5) - Cross-Origin Resource Sharing

### Development Tools
- **nodemon** (v3.1.11) - Auto-restart on file changes
- **sequelize-cli** (v6.6.3) - Sequelize command line interface

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher) or **yarn**
- **PostgreSQL database** (Neon account or local PostgreSQL instance)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd bite-lite-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4001
HOST=localhost
NODE_ENV=development

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# CORS Configuration
ALLOW_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT Configuration (if using authentication)
JWT_SECRET=your-secret-key-here
```

### 4. Database Setup

The application uses Sequelize ORM which will automatically connect to your Neon PostgreSQL database. Make sure your `DATABASE_URL` is correctly configured in the `.env` file.

## 🏃 Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:4001` (or the PORT specified in your `.env` file).

## 📁 Project Structure

```
bite-lite-server/
├── src/
│   ├── config/
│   │   └── database.ts          # Database configuration
│   ├── controllers/              # Request handlers
│   │   ├── category/
│   │   │   ├── index.ts         # Category controller
│   │   │   ├── schema/          # Zod validation schemas
│   │   │   └── service/         # Business logic
│   │   ├── product/
│   │   └── sale/
│   ├── models/                   # Sequelize models
│   │   ├── Category.ts
│   │   ├── Product.ts
│   │   └── Sale.ts
│   ├── routes/                   # Express routes
│   │   ├── categories/
│   │   ├── products/
│   │   └── sales/
│   └── index.ts                  # Application entry point
├── .env                          # Environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Products
- `GET /products` - Get all products (with pagination, search, and filtering)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `POST /products/bulk` - Create multiple products
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create a new category
- `POST /categories/bulk` - Create multiple categories
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Sales
- `GET /sales` - Get all sales (with pagination)
- `GET /sales/:id` - Get sale by ID
- `POST /sales` - Create a new sale
- `PUT /sales/:id` - Update a sale
- `DELETE /sales/:id` - Delete a sale

## 🏗️ Architecture & State Management

### Service Layer Architecture

The application follows a **service layer pattern** for clean separation of concerns:

1. **Routes** (`routes/`) - Define API endpoints and HTTP methods
2. **Controllers** (`controllers/*/index.ts`) - Handle HTTP requests/responses
3. **Services** (`controllers/*/service/`) - Contain business logic and database operations
4. **Models** (`models/`) - Define database schema and relationships
5. **Schemas** (`controllers/*/schema/`) - Zod validation schemas

### API Handling Flow

```
Client Request
    ↓
Route Handler (routes/)
    ↓
Controller (controllers/*/index.ts)
    ├── Validates request parameters
    ├── Calls Service Layer
    └── Returns HTTP response
    ↓
Service Layer (controllers/*/service/)
    ├── Validates data with Zod schemas
    ├── Performs database operations via Sequelize
    ├── Handles business logic
    └── Returns structured response
    ↓
Model Layer (models/)
    └── Sequelize ORM interacts with PostgreSQL
```

### State Management

Since this is a **backend API server**, there is no client-side state management. However, the application manages state through:

1. **Database State** - All persistent data is stored in PostgreSQL via Sequelize ORM
2. **Request/Response State** - Each API request is stateless; state is maintained through:
   - Database records (products, categories, sales)
   - JWT tokens (for authentication, if implemented)
   - Session data (if session management is added)

3. **Application State** - Managed through:
   - Environment variables (`.env`)
   - Database connection pooling
   - Rate limiting counters
   - CORS configuration

### Data Validation

- **Zod Schemas** - All incoming data is validated using Zod schemas before processing
- **Type Safety** - TypeScript ensures type safety throughout the application
- **Sequelize Validation** - Database models include validation rules

## 🔒 Security Features

- **Rate Limiting** - Prevents abuse with configurable request limits
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Zod schema validation on all inputs
- **SQL Injection Protection** - Sequelize ORM provides parameterized queries
- **JWT Support** - Ready for token-based authentication

## 📝 Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env` is correct
- Ensure your Neon database is accessible
- Check SSL configuration if using cloud database

### Port Already in Use
- Change the `PORT` in `.env` file
- Or kill the process using the port: `lsof -ti:4001 | xargs kill`

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

