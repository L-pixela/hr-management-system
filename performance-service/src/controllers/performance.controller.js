const Performance = require('../models/performance.model');

/**
 * Get all performance records
 */
const getAllPerformances = async (req, res) => {
  try {
    const { employeeId, status, startDate, endDate } = req.query;
    
    // Build query filter
    const filter = {};
    if (employeeId) filter.employeeId = employeeId;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.reviewDate = {};
      if (startDate) filter.reviewDate.$gte = new Date(startDate);
      if (endDate) filter.reviewDate.$lte = new Date(endDate);
    }
    
    const performances = await Performance.find(filter)
      .sort({ reviewDate: -1 })
      .lean();
    
    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance records',
      error: error.message
    });
  }
};

/**
 * Get performance record by ID
 */
const getPerformanceById = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching performance record',
      error: error.message
    });
  }
};

/**
 * Get performance records by employee ID
 */
const getPerformanceByEmployeeId = async (req, res) => {
  try {
    const performances = await Performance.find({ 
      employeeId: req.params.employeeId 
    }).sort({ reviewDate: -1 });
    
    res.status(200).json({
      success: true,
      count: performances.length,
      data: performances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee performance records',
      error: error.message
    });
  }
};

/**
 * Create new performance record
 */
const createPerformance = async (req, res) => {
  try {
    const { employeeId, score, comment, reviewedBy, status } = req.body;
    
    // Validation
    if (!employeeId || !score || !reviewedBy) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID, score, and reviewer are required'
      });
    }
    
    const performance = new Performance({
      employeeId,
      score,
      comment,
      reviewedBy,
      status: status || 'draft'
    });
    
    await performance.save();
    
    res.status(201).json({
      success: true,
      message: 'Performance record created successfully',
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating performance record',
      error: error.message
    });
  }
};

/**
 * Update performance record
 */
const updatePerformance = async (req, res) => {
  try {
    const { score, comment, reviewedBy, status } = req.body;
    
    const performance = await Performance.findById(req.params.id);
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    // Update fields
    if (score !== undefined) performance.score = score;
    if (comment !== undefined) performance.comment = comment;
    if (reviewedBy !== undefined) performance.reviewedBy = reviewedBy;
    if (status !== undefined) performance.status = status;
    
    await performance.save();
    
    res.status(200).json({
      success: true,
      message: 'Performance record updated successfully',
      data: performance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating performance record',
      error: error.message
    });
  }
};

/**
 * Delete performance record
 */
const deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    
    if (!performance) {
      return res.status(404).json({
        success: false,
        message: 'Performance record not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Performance record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting performance record',
      error: error.message
    });
  }
};

module.exports = {
  getAllPerformances,
  getPerformanceById,
  getPerformanceByEmployeeId,
  createPerformance,
  updatePerformance,
  deletePerformance
};
