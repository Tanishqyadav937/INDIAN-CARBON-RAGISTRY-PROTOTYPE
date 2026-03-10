import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getDatabaseStatus } from '../config/database.js';
import { getAllProjects, getProjectsByDeveloper } from '../utils/mockData.js';

const router = express.Router();

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    let projects;
    
    if (getDatabaseStatus()) {
      // Use MongoDB (when available)
      const Project = (await import('../models/Project.js')).default;
      projects = await Project.find().populate('developer', 'name organization');
    } else {
      // Use mock data
      projects = getAllProjects();
    }

    res.json({
      success: true,
      data: {
        projects,
        total: projects.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// Get user's projects (protected)
router.get('/my-projects', authenticate, async (req, res) => {
  try {
    let projects;
    
    if (getDatabaseStatus()) {
      // Use MongoDB
      const Project = (await import('../models/Project.js')).default;
      projects = await Project.find({ developer: req.user._id });
    } else {
      // Use mock data
      projects = getProjectsByDeveloper(req.user._id);
    }

    res.json({
      success: true,
      data: {
        projects
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user projects'
    });
  }
});

// Create new project (protected)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, projectType, location, carbonCredits } = req.body;

    // Validate required fields
    if (!title || !projectType || !location?.state || !carbonCredits?.estimatedAnnual) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, projectType, location.state, carbonCredits.estimatedAnnual'
      });
    }

    let newProject;

    if (getDatabaseStatus()) {
      // Use MongoDB
      const Project = (await import('../models/Project.js')).default;
      
      newProject = new Project({
        title,
        description: `${projectType} project in ${location.state}${location.district ? ', ' + location.district : ''}`,
        developer: req.user._id,
        projectType,
        location: {
          state: location.state,
          district: location.district || undefined
        },
        carbonCredits: {
          estimatedAnnual: carbonCredits.estimatedAnnual,
          generated: 0,
          issued: 0,
          traded: 0,
          retired: 0
        },
        status: 'Under Review',
        timeline: {
          startDate: new Date(),
          endDate: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years from now
          creditingPeriod: { years: 10 }
        }
      });

      await newProject.save();
    } else {
      // Use mock data - simulate project creation
      const year = new Date().getFullYear();
      const mockId = Math.floor(Math.random() * 10000);
      
      newProject = {
        _id: `mock_${mockId}`,
        projectId: `ICR-${year}-${String(mockId).padStart(4, '0')}`,
        title,
        projectType,
        status: 'Under Review',
        carbonCredits: {
          estimatedAnnual: carbonCredits.estimatedAnnual,
          generated: 0,
          issued: 0,
          traded: 0,
          retired: 0
        },
        location: {
          state: location.state,
          district: location.district
        },
        developer: req.user._id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        project: newProject
      }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project'
    });
  }
});

export default router;
