import { DepartmentService } from "../services/department.service.js";

export const DepartmentController = {
  async create(req, res, next) {
    try {
      const result = await DepartmentService.createDepartment(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const result = await DepartmentService.getDepartments();
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async get(req, res, next) {
    try {
      const result = await DepartmentService.getDepartmentById(req.params.id);
      if (!result) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const result = await DepartmentService.updateDepartment(
        req.params.id,
        req.body
      );

      if (!result) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const result = await DepartmentService.deleteDepartment(req.params.id);

      if (!result) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};
