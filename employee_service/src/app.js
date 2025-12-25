import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.route.js";
import departmentRoutes from "./routes/department.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

// CORS configuration - allows frontend to make API requests
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    
    // Allow localhost and common development ports
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:4173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
    ];
    
    // In production, add your deployed frontend URL
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }
    
    // Allow all origins in development
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);
app.use("/departments", departmentRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: "employee-service" }));

// Error handler
app.use(errorHandler);

export default app;
