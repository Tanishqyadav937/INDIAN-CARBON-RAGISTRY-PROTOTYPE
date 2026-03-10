// Mock data store for demo mode when MongoDB is not available
import bcrypt from 'bcryptjs';

// Mock users database (in-memory)
export const mockUsers = [
  {
    _id: '64f0b2c1234567890abcdef0',
    name: 'Demo Administrator',
    email: 'demo@carbonregistry.gov.in',
    password: '$2a$12$jVJCjxx/XkR/AxT/w3nCPuPOwBCGhcKDTaMLXkZqnDLZMszqv41PS', // demo123 hashed
    role: 'admin',
    status: 'active',
    verification: { isEmailVerified: true },
    organization: {
      name: 'India Carbon Registry',
      type: 'Government'
    },
    profile: {
      phone: '+91 98765 43210'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '64f0b2c1234567890abcdef1',
    name: 'Green Energy Corp',
    email: 'contact@greenenergy.com',
    password: '$2a$12$jVJCjxx/XkR/AxT/w3nCPuPOwBCGhcKDTaMLXkZqnDLZMszqv41PS', // demo123 hashed
    role: 'developer',
    status: 'active',
    verification: { isEmailVerified: true },
    organization: {
      name: 'Green Energy Corporation',
      type: 'Corporate',
      registrationNumber: 'CIN123456789'
    },
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

// Mock projects database (in-memory)
export const mockProjects = [
  {
    _id: '64f0b2c1234567890abcdef2',
    projectId: 'ICR-2024-001',
    title: 'Solar Farm Project - Rajasthan',
    description: 'Large-scale solar photovoltaic installation in Jodhpur, Rajasthan. This project aims to generate clean renewable energy while offsetting carbon emissions from traditional grid electricity.',
    developer: '64f0b2c1234567890abcdef1',
    projectType: 'Renewable Energy',
    location: {
      state: 'Rajasthan',
      district: 'Jodhpur',
      coordinates: { latitude: 26.2389, longitude: 73.0243 },
      address: 'Jodhpur Solar Park, Rajasthan'
    },
    timeline: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2034-01-15'),
      creditingPeriod: { years: 10 }
    },
    carbonCredits: {
      estimatedAnnual: 1250,
      totalEstimated: 12500,
      generated: 980,
      issued: 850,
      traded: 200,
      retired: 50
    },
    status: 'Active',
    verification: {
      validator: '64f0b2c1234567890abcdef0',
      validationDate: new Date('2024-02-01'),
      certificationBody: 'India Carbon Verification Bureau'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: '64f0b2c1234567890abcdef3',
    projectId: 'ICR-2024-002',
    title: 'Forest Conservation - Kerala',
    description: 'Reforestation and forest conservation project in Western Ghats, Kerala. Focused on protecting biodiversity hotspots while sequestering carbon through natural forest regeneration.',
    developer: '64f0b2c1234567890abcdef1',
    projectType: 'Forestry',
    location: {
      state: 'Kerala',
      district: 'Wayanad',
      coordinates: { latitude: 11.6854, longitude: 76.1320 },
      address: 'Western Ghats Forest Reserve, Wayanad'
    },
    timeline: {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2043-06-01'),
      creditingPeriod: { years: 20 }
    },
    carbonCredits: {
      estimatedAnnual: 850,
      totalEstimated: 17000,
      generated: 1200,
      issued: 1100,
      traded: 300,
      retired: 100
    },
    status: 'Under Review',
    verification: {
      validator: '64f0b2c1234567890abcdef0',
      validationDate: new Date('2023-08-15'),
      certificationBody: 'Forest Carbon Verification'
    },
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-01')
  }
];

// Mock transactions database (in-memory)
export const mockTransactions = [
  {
    _id: '64f0b2c1234567890abcdef4',
    transactionId: 'TXN-2024-000001',
    project: '64f0b2c1234567890abcdef2',
    type: 'issuance',
    to: '64f0b2c1234567890abcdef1',
    credits: 850,
    status: 'completed',
    verification: {
      isVerified: true,
      verifiedBy: '64f0b2c1234567890abcdef0',
      verificationDate: new Date('2024-02-15')
    },
    metadata: {
      vintage: '2024',
      standard: 'India Carbon Standard',
      methodology: 'CDM-AM-0002'
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  },
  {
    _id: '64f0b2c1234567890abcdef5',
    transactionId: 'TXN-2024-000002',
    project: '64f0b2c1234567890abcdef2',
    type: 'transfer',
    from: '64f0b2c1234567890abcdef1',
    to: '64f0b2c1234567890abcdef0',
    credits: 200,
    pricePerCredit: 1500,
    totalAmount: 300000,
    status: 'completed',
    verification: {
      isVerified: true,
      verifiedBy: '64f0b2c1234567890abcdef0',
      verificationDate: new Date('2024-03-01')
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

// Helper functions for mock database operations
export const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (id) => {
  return mockUsers.find(user => user._id === id);
};

export const createUser = (userData) => {
  const newUser = {
    _id: `64f0b2c1234567890abcdef${mockUsers.length}`,
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockUsers.push(newUser);
  return newUser;
};

export const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

export const getAllProjects = () => {
  return mockProjects;
};

export const getProjectsByDeveloper = (developerId) => {
  return mockProjects.filter(project => project.developer === developerId);
};

export const getDashboardStats = () => {
  const totalProjects = mockProjects.length;
  const totalCredits = mockProjects.reduce((sum, project) => sum + project.carbonCredits.issued, 0);
  const tradedCredits = mockProjects.reduce((sum, project) => sum + project.carbonCredits.traded, 0);
  const revenue = mockTransactions
    .filter(tx => tx.type === 'transfer' && tx.totalAmount)
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  return {
    totalProjects,
    totalCredits,
    tradedCredits,
    revenue
  };
};

console.log('📊 Mock database initialized with demo data');
console.log(`👥 Users: ${mockUsers.length}, 🏗️ Projects: ${mockProjects.length}, 💱 Transactions: ${mockTransactions.length}`);
