// Project Service - Type definitions and utilities

export interface Project {
  _id: string;
  projectId: string;
  title: string;
  description?: string;
  projectType: string;
  status: string;
  location: {
    state: string;
    district?: string;
  };
  carbonCredits: {
    estimatedAnnual: number;
    generated: number;
    issued: number;
    traded: number;
    retired: number;
  };
  createdAt: string;
  updatedAt?: string;
}
