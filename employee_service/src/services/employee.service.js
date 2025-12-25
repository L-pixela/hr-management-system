import Employee from "../models/employee.model.js";
import Department from "../models/department.model.js";

export const EmployeeService = {
  async createEmployee(data) {
    // 1️⃣ Ensure department exists
    const departmentExists = await Department.findById(data.department);
    if (!departmentExists) {
      throw new Error("Department does not exist");
    }

    return Employee.create(data);
  },

  async getEmployees() {
    // 2️⃣ Populate department info
    return Employee.find().populate("department", "name status");
  },

  async getEmployeeById(id) {
    return Employee.findById(id).populate("department", "name status");
  },

  async updateEmployee(id, data) {
    // 3️⃣ Validate department if it's being updated
    if (data.department) {
      const departmentExists = await Department.findById(data.department);
      if (!departmentExists) {
        throw new Error("Department does not exist");
      }
    }

    return Employee.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("department", "name status");
  },

  async deleteEmployee(id) {
    return Employee.findByIdAndDelete(id);
  },
};
