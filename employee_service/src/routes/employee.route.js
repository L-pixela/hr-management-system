import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller.js";

const router = Router();

router.post("/", EmployeeController.create);
router.get("/", EmployeeController.list);
router.get("/:id", EmployeeController.get);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.remove);

export default router;
