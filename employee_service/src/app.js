import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employee.route.js";
import departmentRoutes from "./routes/department.routes.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);
app.use("/departments", departmentRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ status: "ok", service: "employee-service" }));

// Error handler
app.use(errorHandler);

export default app;
