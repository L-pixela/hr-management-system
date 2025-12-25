import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// All employee routes require authentication
router.post("/", authMiddleware, EmployeeController.create);
router.get("/", authMiddleware, EmployeeController.list);
router.get("/:id", authMiddleware, EmployeeController.get);
router.put("/:id", authMiddleware, EmployeeController.update);
router.delete("/:id", authMiddleware, EmployeeController.remove);

export default router;
