import Employee from "../models/employee.model.js";

export const EmployeeService = {
  async createEmployee(data) {
    return Employee.create(data);
  },

  async getEmployees() {
    return Employee.find();
  },

  async getEmployeeById(id) {
    return Employee.findById(id);
  },

  async updateEmployee(id, data) {
    return Employee.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  }
};
