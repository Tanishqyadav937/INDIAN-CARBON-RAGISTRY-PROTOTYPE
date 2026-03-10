import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Transaction from '../models/Transaction.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Transaction.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create demo users
    const hashedPassword = await bcrypt.hash('demo123', 12);

    const demoUsers = [
      {
        name: 'Demo Administrator',
        email: 'demo@carbonregistry.gov.in',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        verification: { isEmailVerified: true },
        organization: {
          name: 'India Carbon Registry',
          type: 'Government'
        },
        profile: {
          phone: '+91 98765 43210'
        }
      }
    ];

    const users = await User.create(demoUsers);
    console.log('👥 Created demo users:', users.length);

    // Create demo projects
    const demoProjects = [
      {
        projectId: `ICR-${new Date().getFullYear()}-0001`,
        title: 'Solar Farm Project - Rajasthan',
        description: 'Large-scale solar photovoltaic installation in Jodhpur, Rajasthan. This project aims to generate clean renewable energy while offsetting carbon emissions from traditional grid electricity.',
        developer: users[0]._id,
        projectType: 'Renewable Energy',
        methodology: {
          name: 'Solar PV Grid Connection',
          version: '2.1',
          reference: 'CDM-AM-0002'
        },
        location: {
          state: 'Rajasthan',
          district: 'Jodhpur',
          coordinates: {
            latitude: 26.2389,
            longitude: 73.0243
          },
          address: 'Jodhpur Solar Park, Rajasthan'
        },
        timeline: {
          startDate: new Date('2024-01-15'),
          endDate: new Date('2034-01-15'),
          creditingPeriod: { years: 10 }
        },
        carbonCredits: {
          estimatedAnnual: 1250,
          generated: 980,
          issued: 850,
          traded: 200,
          retired: 50
        },
        status: 'Active',
        verification: {
          validator: users[0]._id,
          validationDate: new Date('2024-02-01'),
          certificationBody: 'India Carbon Verification Bureau'
        },
        financials: {
          projectCost: 5000000000, // 50 Crores
          currency: 'INR',
          fundingSource: 'Private Investment',
          expectedRevenue: 1500000000 // 15 Crores
        },
        sustainability: {
          sdgGoals: [7, 13, 8], // Clean Energy, Climate Action, Economic Growth
          cobenefits: ['Job Creation', 'Energy Security', 'Rural Development'],
          environmentalImpact: 'Reduces 1,250 tCO2e annually',
          socialImpact: 'Created 150+ local jobs'
        }
      },
      {
        projectId: `ICR-${new Date().getFullYear()}-0002`,
        title: 'Forest Conservation - Kerala',
        description: 'Reforestation and forest conservation project in Western Ghats, Kerala. Focused on protecting biodiversity hotspots while sequestering carbon through natural forest regeneration.',
        developer: users[0]._id,
        projectType: 'Forestry',
        methodology: {
          name: 'A/R Small-scale',
          version: '3.0',
          reference: 'CDM-SSC-AR-001'
        },
        location: {
          state: 'Kerala',
          district: 'Wayanad',
          coordinates: {
            latitude: 11.6854,
            longitude: 76.1320
          },
          address: 'Western Ghats Forest Reserve, Wayanad'
        },
        timeline: {
          startDate: new Date('2023-06-01'),
          endDate: new Date('2043-06-01'),
          creditingPeriod: { years: 20 }
        },
        carbonCredits: {
          estimatedAnnual: 850,
          generated: 1200,
          issued: 1100,
          traded: 300,
          retired: 100
        },
        status: 'Active',
        verification: {
          validator: users[0]._id,
          validationDate: new Date('2023-08-15'),
          certificationBody: 'Forest Carbon Verification'
        },
        financials: {
          projectCost: 2500000000, // 25 Crores
          currency: 'INR',
          fundingSource: 'Government Grant + NGO Funding',
          expectedRevenue: 850000000 // 8.5 Crores
        },
        sustainability: {
          sdgGoals: [15, 13, 6], // Life on Land, Climate Action, Clean Water
          cobenefits: ['Biodiversity Conservation', 'Watershed Protection', 'Tribal Community Support'],
          environmentalImpact: 'Sequesters 850 tCO2e annually, protects 500+ species',
          socialImpact: 'Benefits 2000+ tribal community members'
        }
      },
      {
        projectId: `ICR-${new Date().getFullYear()}-0003`,
        title: 'Wind Energy Project - Gujarat',
        description: 'Offshore wind energy project off the coast of Gujarat. Utilizing coastal wind resources to generate clean electricity and reduce dependence on fossil fuels.',
        developer: users[0]._id,
        projectType: 'Renewable Energy',
        methodology: {
          name: 'Wind Power Generation',
          version: '1.5',
          reference: 'CDM-AM-0074'
        },
        location: {
          state: 'Gujarat',
          district: 'Kutch',
          coordinates: {
            latitude: 22.7196,
            longitude: 68.8594
          },
          address: 'Gulf of Kutch Wind Park'
        },
        timeline: {
          startDate: new Date('2023-10-01'),
          endDate: new Date('2048-10-01'),
          creditingPeriod: { years: 25 }
        },
        carbonCredits: {
          estimatedAnnual: 2100,
          generated: 1800,
          issued: 1650,
          traded: 500,
          retired: 150
        },
        status: 'Active',
        verification: {
          validator: users[0]._id,
          validationDate: new Date('2023-12-01'),
          certificationBody: 'Renewable Energy Verification Agency'
        },
        financials: {
          projectCost: 8000000000, // 80 Crores
          currency: 'INR',
          fundingSource: 'International Green Bond',
          expectedRevenue: 3150000000 // 31.5 Crores
        },
        sustainability: {
          sdgGoals: [7, 13, 14], // Clean Energy, Climate Action, Life Below Water
          cobenefits: ['Energy Independence', 'Coastal Development', 'Technology Transfer'],
          environmentalImpact: 'Avoids 2,100 tCO2e annually',
          socialImpact: 'Training programs for 500+ technical workers'
        }
      },
      {
        projectId: `ICR-${new Date().getFullYear()}-0004`,
        title: 'Biogas Plant - Punjab',
        description: 'Agricultural waste-to-energy biogas project converting crop residues into renewable energy. Addresses stubble burning while generating carbon credits.',
        developer: users[0]._id,
        projectType: 'Waste Management',
        methodology: {
          name: 'Biogas from Agricultural Waste',
          version: '2.0',
          reference: 'CDM-AM-0025'
        },
        location: {
          state: 'Punjab',
          district: 'Ludhiana',
          coordinates: {
            latitude: 30.9010,
            longitude: 75.8573
          },
          address: 'Punjab Agricultural Biogas Facility'
        },
        timeline: {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2031-03-01'),
          creditingPeriod: { years: 7 }
        },
        carbonCredits: {
          estimatedAnnual: 675,
          generated: 480,
          issued: 420,
          traded: 100,
          retired: 20
        },
        status: 'Under Review',
        financials: {
          projectCost: 1500000000, // 15 Crores
          currency: 'INR',
          fundingSource: 'State Government Subsidy',
          expectedRevenue: 500000000 // 5 Crores
        },
        sustainability: {
          sdgGoals: [7, 12, 2], // Clean Energy, Responsible Consumption, Zero Hunger
          cobenefits: ['Air Quality Improvement', 'Farmer Income', 'Waste Reduction'],
          environmentalImpact: 'Prevents 675 tCO2e emissions from crop burning',
          socialImpact: 'Benefits 1500+ farmers in the region'
        }
      }
    ];

    const projects = await Project.create(demoProjects);
    console.log('🏗️  Created demo projects:', projects.length);

    // Create demo transactions
    const demoTransactions = [
      {
        transactionId: `TXN-${new Date().getFullYear()}-000001`,
        project: projects[0]._id,
        type: 'issuance',
        to: users[0]._id,
        credits: 850,
        status: 'completed',
        verification: {
          isVerified: true,
          verifiedBy: users[0]._id,
          verificationDate: new Date('2024-02-15')
        },
        metadata: {
          vintage: '2024',
          standard: 'India Carbon Standard',
          methodology: 'CDM-AM-0002'
        }
      },
      {
        transactionId: `TXN-${new Date().getFullYear()}-000002`,
        project: projects[0]._id,
        type: 'transfer',
        from: users[0]._id,
        to: users[0]._id,
        credits: 200,
        pricePerCredit: 1500,
        totalAmount: 300000,
        status: 'completed',
        verification: {
          isVerified: true,
          verifiedBy: users[0]._id,
          verificationDate: new Date('2024-03-01')
        }
      },
      {
        transactionId: `TXN-${new Date().getFullYear()}-000003`,
        project: projects[1]._id,
        type: 'retirement',
        from: users[0]._id,
        credits: 100,
        reason: 'Corporate sustainability commitment',
        retirementDetails: {
          beneficiary: 'Tech Corporation Ltd',
          purpose: 'Annual carbon neutrality',
          retirementDate: new Date('2024-03-15')
        },
        status: 'completed',
        verification: {
          isVerified: true,
          verifiedBy: users[0]._id,
          verificationDate: new Date('2024-03-16')
        }
      }
    ];

    const transactions = await Transaction.create(demoTransactions);
    console.log('💱 Created demo transactions:', transactions.length);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Email: demo@carbonregistry.gov.in');
    console.log('Password: demo123');
    console.log('Role: Administrator');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData();
