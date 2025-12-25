import {Router} from "express";
import { DepartmentController } from "../controllers/department.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, DepartmentController.create);
router.get("/", authMiddleware, DepartmentController.list);
router.get("/:id", authMiddleware, DepartmentController.get);
router.put("/:id", authMiddleware, DepartmentController.update);
router.delete("/:id", authMiddleware, DepartmentController.remove);

export default router;
