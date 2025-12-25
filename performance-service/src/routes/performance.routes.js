const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performance.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /performance - Get all performance records (with optional filters)
router.get('/', performanceController.getAllPerformances);

// GET /performance/:id - Get performance record by ID
router.get('/:id', performanceController.getPerformanceById);

// GET /performance/employee/:employeeId - Get all performance records for an employee
router.get('/employee/:employeeId', performanceController.getPerformanceByEmployeeId);

// POST /performance - Create new performance record
router.post('/', performanceController.createPerformance);

// PUT /performance/:id - Update performance record
router.put('/:id', performanceController.updatePerformance);

// DELETE /performance/:id - Delete performance record
router.delete('/:id', performanceController.deletePerformance);

module.exports = router;
