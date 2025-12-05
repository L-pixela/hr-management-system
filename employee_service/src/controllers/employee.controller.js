import { EmployeeService } from "../services/employee.service.js";

export const EmployeeController = {
  async create(req, res, next) {
    try {
      const result = await EmployeeService.createEmployee(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const result = await EmployeeService.getEmployees();
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async get(req, res, next) {
    try {
      const result = await EmployeeService.getEmployeeById(req.params.id);
      if (!result) return res.status(404).json({ message: "Not found" });
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const result = await EmployeeService.updateEmployee(req.params.id, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await EmployeeService.deleteEmployee(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
};
