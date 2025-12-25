const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: [true, 'Employee ID is required'],
    trim: true
  },
  reviewDate: {
    type: Date,
    default: Date.now
  },
  score: {
    type: Number,
    required: [true, 'Performance score is required'],
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  reviewedBy: {
    type: String,
    required: [true, 'Reviewer information is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Add index for faster queries
performanceSchema.index({ employeeId: 1, reviewDate: -1 });

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
