import express from "express";
import cors from "cors";
import employeeRoutes from "./src/routes/employee.route.js";
import { errorHandler } from "./src/middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/employees", employeeRoutes);

// Error handler
app.use(errorHandler);

export default app;
