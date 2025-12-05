import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String },
  department: { type: String },
  dateOfJoining: { type: Date },
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, {
  timestamps: true
});

export default mongoose.model("Employee", EmployeeSchema);
