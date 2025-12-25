import Department from "../models/department.model.js";
import Employee from "../models/employee.model.js";

export const DepartmentService = {
  async createDepartment(data) {
    return Department.create(data);
  },

  async getDepartments() {
    return Department.find();
  },

  async getDepartmentById(id) {
    return Department.findById(id);
  },

  async updateDepartment(id, data) {
    return Department.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteDepartment(id) {
    // 4️⃣ Prevent deleting department with employees
    const employeeCount = await Employee.countDocuments({ department: id });

    if (employeeCount > 0) {
      throw new Error(
        "Cannot delete department while employees are assigned to it"
      );
    }

    return Department.findByIdAndDelete(id);
  },
};
