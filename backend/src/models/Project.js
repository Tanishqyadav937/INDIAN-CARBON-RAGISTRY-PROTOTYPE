import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  developer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectType: {
    type: String,
    required: true,
    enum: [
      'Renewable Energy',
      'Energy Efficiency',
      'Forestry',
      'Agriculture',
      'Waste Management',
      'Transportation',
      'Industrial Processes',
      'Buildings',
      'Other'
    ]
  },
  methodology: {
    name: String,
    version: String,
    reference: String
  },
  location: {
    country: { type: String, default: 'India' },
    state: { type: String, required: true },
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    creditingPeriod: {
      years: { type: Number, default: 10 }
    }
  },
  carbonCredits: {
    estimatedAnnual: {
      type: Number,
      required: true,
      min: [1, 'Estimated annual credits must be at least 1']
    },
    totalEstimated: Number,
    generated: {
      type: Number,
      default: 0
    },
    issued: {
      type: Number,
      default: 0
    },
    traded: {
      type: Number,
      default: 0
    },
    retired: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: [
      'Draft',
      'Under Review',
      'Validation Required',
      'Validated',
      'Registered',
      'Active',
      'Monitoring',
      'Verification Required',
      'Verified',
      'Completed',
      'Suspended',
      'Rejected'
    ],
    default: 'Draft'
  },
  verification: {
    validator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    validationDate: Date,
    certificationBody: String,
    verificationReports: [{
      period: String,
      reportDate: Date,
      verifier: String,
      creditsVerified: Number,
      documentUrl: String
    }]
  },
  documents: [{
    name: String,
    type: {
      type: String,
      enum: ['PDD', 'Monitoring Report', 'Verification Report', 'Certificate', 'Other']
    },
    url: String,
    uploadDate: Date,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  financials: {
    projectCost: Number,
    currency: { type: String, default: 'INR' },
    fundingSource: String,
    expectedRevenue: Number
  },
  sustainability: {
    sdgGoals: [Number], // UN SDG goals (1-17)
    cobenefits: [String],
    environmentalImpact: String,
    socialImpact: String
  },
  monitoring: {
    lastMonitoringDate: Date,
    nextMonitoringDate: Date,
    monitoringFrequency: {
      type: String,
      enum: ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual'],
      default: 'Annual'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for available credits
projectSchema.virtual('availableCredits').get(function() {
  return this.carbonCredits.issued - this.carbonCredits.traded - this.carbonCredits.retired;
});

// Pre-save middleware to generate project ID
projectSchema.pre('save', async function(next) {
  if (!this.projectId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Project').countDocuments();
    this.projectId = `ICR-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  
  // Calculate total estimated credits
  if (this.carbonCredits.estimatedAnnual && this.timeline.creditingPeriod?.years) {
    this.carbonCredits.totalEstimated = this.carbonCredits.estimatedAnnual * this.timeline.creditingPeriod.years;
  }
  
  next();
});

// Indexes for better query performance
projectSchema.index({ projectId: 1 });
projectSchema.index({ developer: 1 });
projectSchema.index({ projectType: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'location.state': 1 });
projectSchema.index({ createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
