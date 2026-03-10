import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDatabaseStatus } from '../config/database.js';
import { getDashboardStats, getProjectsByDeveloper } from '../utils/mockData.js';

const router = express.Router();

// Get dashboard statistics (protected)
router.get('/stats', authenticate, async (req, res) => {
  try {
    let stats;
    
    if (getDatabaseStatus()) {
      // Use MongoDB for real stats (when available)
      const Project = (await import('../models/Project.js')).default;
      const Transaction = (await import('../models/Transaction.js')).default;
      
      const totalProjects = await Project.countDocuments();
      const totalCreditsResult = await Project.aggregate([
        { $group: { _id: null, total: { $sum: "$carbonCredits.issued" } } }
      ]);
      const tradedCreditsResult = await Project.aggregate([
        { $group: { _id: null, total: { $sum: "$carbonCredits.traded" } } }
      ]);
      const revenueResult = await Transaction.aggregate([
        { $match: { type: 'transfer', status: 'completed' } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]);

      stats = {
        totalProjects,
        totalCredits: totalCreditsResult[0]?.total || 0,
        tradedCredits: tradedCreditsResult[0]?.total || 0,
        revenue: revenueResult[0]?.total || 0
      };
    } else {
      // Use mock data
      stats = getDashboardStats();
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
});

// Get user's recent projects (protected)
router.get('/recent-projects', authenticate, async (req, res) => {
  try {
    let projects;
    
    if (getDatabaseStatus()) {
      // Use MongoDB
      const Project = (await import('../models/Project.js')).default;
      projects = await Project.find({ developer: req.user._id })
        .sort({ createdAt: -1 })
        .limit(5);
    } else {
      // Use mock data
      projects = getProjectsByDeveloper(req.user._id).slice(0, 5);
    }

    res.json({
      success: true,
      data: { projects }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recent projects'
    });
  }
});

export default router;
