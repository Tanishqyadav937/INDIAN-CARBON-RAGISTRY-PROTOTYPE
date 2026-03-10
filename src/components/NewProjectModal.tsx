import { useState } from 'react';
import { Button } from './ui/button';
import { 
  X, 
  FileText, 
  Tag, 
  MapPin, 
  Calculator, 
  ChevronDown,
  Leaf
} from 'lucide-react';

interface NewProjectModalProps {
  onClose: () => void;
  onCreateProject: (projectData: any) => void;
  isCreating?: boolean;
}

export function NewProjectModal({ onClose, onCreateProject, isCreating = false }: NewProjectModalProps) {
  const [title, setTitle] = useState('');
  const [projectType, setProjectType] = useState('Renewable Energy');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [estimatedAnnual, setEstimatedAnnual] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      title,
      projectType,
      status: 'Pending',
      carbonCredits: {
        estimatedAnnual,
        generated: 0,
        issued: 0,
        traded: 0,
        retired: 0
      },
      location: {
        state,
        district
      }
    };
    
    onCreateProject(projectData);
  };
  
  return (
    <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
        <div className="border-b border-neutral-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-neutral-800 flex items-center">
              <Leaf className="h-5 w-5 mr-2 text-primary-600" />
              Register New Project
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-neutral-500" />
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border border-neutral-300 rounded-md px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. Solar Farm Project - Maharashtra"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-neutral-500" />
                  Project Type
                </label>
                <div className="relative">
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="appearance-none border border-neutral-300 rounded-md px-4 py-2.5 w-full bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="Renewable Energy">Renewable Energy</option>
                    <option value="Forestry">Forestry</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Waste Management">Waste Management</option>
                    <option value="Energy Efficiency">Energy Efficiency</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="border border-neutral-300 rounded-md px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. Maharashtra"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="border border-neutral-300 rounded-md px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g. Pune"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-neutral-500" />
                  Estimated Annual Carbon Credits
                </label>
                <input
                  type="number"
                  min="0"
                  value={estimatedAnnual}
                  onChange={(e) => setEstimatedAnnual(Number(e.target.value))}
                  className="border border-neutral-300 rounded-md px-4 py-2.5 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. 1000"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 border-t border-neutral-200 pt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary-600 hover:bg-primary-700 text-white"
                disabled={!title || !state || estimatedAnnual <= 0 || isCreating}
              >
                {isCreating ? 'Creating Project...' : 'Register Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}