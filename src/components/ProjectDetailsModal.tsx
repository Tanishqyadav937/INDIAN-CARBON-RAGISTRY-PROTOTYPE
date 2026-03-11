import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText,
  MapPin,
  Calendar,
  Tag,
  BarChart,
  Leaf,
  ArrowUpRight,
  ArchiveX
} from 'lucide-react';
import { colors } from '../lib/designSystem';
import { Project } from '../lib/projectService';
import { Transaction } from '../lib/blockchain';
import { TransactionHistory } from './TransactionHistory';

interface ProjectDetailsModalProps {
  project: Project;
  transactions: Transaction[];
  onClose: () => void;
  onIssueCredits: (projectId: string, amount: number) => void;
  onTradeCredits: (projectId: string, amount: number, price: number) => void;
  onRetireCredits: (projectId: string, amount: number, reason: string) => void;
}

export function ProjectDetailsModal({
  project,
  transactions,
  onClose,
  onIssueCredits,
  onTradeCredits,
  onRetireCredits
}: ProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'transactions'>('details');
  const [issueAmount, setIssueAmount] = useState<number>(0);
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [tradePrice, setTradePrice] = useState<number>(1200);
  const [retireAmount, setRetireAmount] = useState<number>(0);
  const [retireReason, setRetireReason] = useState<string>('');
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { 
        color: `bg-${colors.status.success}20 text-${colors.status.success} border-${colors.status.success}40`, 
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> 
      },
      'Under Review': { 
        color: `bg-${colors.status.warning}20 text-${colors.status.warning} border-${colors.status.warning}40`, 
        icon: <Clock className="h-3.5 w-3.5 mr-1" /> 
      },
      'Verified': { 
        color: `bg-${colors.accent.blue}20 text-${colors.accent.blue} border-${colors.accent.blue}40`, 
        icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> 
      },
      'Pending': { 
        color: `bg-${colors.neutral[500]}20 text-${colors.neutral[700]} border-${colors.neutral[300]}`, 
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" /> 
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    
    return (
      <Badge className={config.color}>
        <span className="flex items-center">
          {config.icon} {status}
        </span>
      </Badge>
    );
  };

  const availableCredits = project.carbonCredits.issued - project.carbonCredits.traded - project.carbonCredits.retired;

  const handleIssueCredits = () => {
    if (issueAmount <= 0) return;
    onIssueCredits(project.projectId, issueAmount);
    setIssueAmount(0);
  };

  const handleTradeCredits = () => {
    if (tradeAmount <= 0 || tradeAmount > availableCredits) return;
    onTradeCredits(project.projectId, tradeAmount, tradePrice);
    setTradeAmount(0);
  };

  const handleRetireCredits = () => {
    if (retireAmount <= 0 || retireAmount > availableCredits || !retireReason) return;
    onRetireCredits(project.projectId, retireAmount, retireReason);
    setRetireAmount(0);
    setRetireReason('');
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="border-b border-neutral-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-neutral-800">{project.title}</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 px-6 pb-4">
            <div className="text-sm font-mono text-neutral-500">{project.projectId}</div>
            {getStatusBadge(project.status)}
          </div>
          
          <div className="flex border-t border-neutral-200">
            <button
              className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'details' 
                ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50/50' 
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'}`}
              onClick={() => setActiveTab('details')}
            >
              <span className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Project Details
              </span>
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm transition-colors ${activeTab === 'transactions' 
                ? 'border-b-2 border-primary-600 text-primary-700 bg-primary-50/50' 
                : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'}`}
              onClick={() => setActiveTab('transactions')}
            >
              <span className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Transaction History
              </span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === 'details' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary-600" />
                    Project Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-neutral-500 block mb-1">Type</span>
                      <p className="font-medium text-neutral-800 flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-neutral-500" />
                        {project.projectType}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block mb-1">Location</span>
                      <p className="font-medium text-neutral-800 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                        {project.location.district ? `${project.location.district}, ` : ''}{project.location.state}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block mb-1">Status</span>
                      <div className="font-medium text-neutral-800">
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-neutral-500 block mb-1">Created</span>
                      <p className="font-medium text-neutral-800 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-neutral-800 mb-4 flex items-center">
                    <Leaf className="h-5 w-5 mr-2 text-primary-600" />
                    Carbon Credits
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <span className="text-sm text-neutral-500 block mb-1">Estimated Annual</span>
                      <p className="text-lg font-medium text-neutral-800">{project.carbonCredits.estimatedAnnual}</p>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <span className="text-sm text-neutral-500 block mb-1">Generated</span>
                      <p className="text-lg font-medium text-neutral-800">{project.carbonCredits.generated}</p>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <span className="text-sm text-neutral-500 block mb-1">Issued</span>
                      <p className="text-lg font-medium text-neutral-800">{project.carbonCredits.issued}</p>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <span className="text-sm text-neutral-500 block mb-1">Traded</span>
                      <p className="text-lg font-medium text-neutral-800">{project.carbonCredits.traded}</p>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-4">
                      <span className="text-sm text-neutral-500 block mb-1">Retired</span>
                      <p className="text-lg font-medium text-neutral-800">{project.carbonCredits.retired}</p>
                    </div>
                    <div className="border border-neutral-200 rounded-lg p-4 bg-primary-50">
                      <span className="text-sm text-neutral-500 block mb-1">Available</span>
                      <p className="text-lg font-medium text-primary-700">{availableCredits}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-neutral-200 pt-8 mb-4">
                <h3 className="text-lg font-medium text-neutral-800 mb-6">Credit Management</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Issue Credits */}
                  <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-green-50 px-4 py-3 border-b border-green-100">
                      <h4 className="font-medium text-green-800 flex items-center">
                        <Leaf className="h-4 w-4 mr-2" />
                        Issue Credits
                      </h4>
                    </div>
                    <div className="p-4">
                      <label className="text-sm text-neutral-600 block mb-2">Amount</label>
                      <div className="flex">
                        <input
                          type="number"
                          min="1"
                          value={issueAmount}
                          onChange={(e) => setIssueAmount(Number(e.target.value))}
                          className="border border-neutral-300 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <Button 
                          className="rounded-l-none bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleIssueCredits}
                          disabled={issueAmount <= 0}
                        >
                          Issue
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trade Credits */}
                  <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
                      <h4 className="font-medium text-purple-800 flex items-center">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Trade Credits
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <label className="text-sm text-neutral-600 block mb-2">Amount</label>
                        <input
                          type="number"
                          min="1"
                          max={availableCredits}
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(Number(e.target.value))}
                          className="border border-neutral-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-600 block mb-2">Price (₹)</label>
                        <div className="flex">
                          <input
                            type="number"
                            min="1"
                            value={tradePrice}
                            onChange={(e) => setTradePrice(Number(e.target.value))}
                            className="border border-neutral-300 rounded-l px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          />
                          <Button 
                            className="rounded-l-none bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={handleTradeCredits}
                            disabled={tradeAmount <= 0 || tradeAmount > availableCredits}
                          >
                            Trade
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Retire Credits */}
                  <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-amber-50 px-4 py-3 border-b border-amber-100">
                      <h4 className="font-medium text-amber-800 flex items-center">
                        <ArchiveX className="h-4 w-4 mr-2" />
                        Retire Credits
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="mb-3">
                        <label className="text-sm text-neutral-600 block mb-2">Amount</label>
                        <input
                          type="number"
                          min="1"
                          max={availableCredits}
                          value={retireAmount}
                          onChange={(e) => setRetireAmount(Number(e.target.value))}
                          className="border border-neutral-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-neutral-600 block mb-2">Reason</label>
                        <input
                          type="text"
                          value={retireReason}
                          onChange={(e) => setRetireReason(e.target.value)}
                          className="border border-neutral-300 rounded px-3 py-2 w-full mb-3 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Corporate offset"
                        />
                        <Button 
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                          onClick={handleRetireCredits}
                          disabled={retireAmount <= 0 || retireAmount > availableCredits || !retireReason}
                        >
                          Retire Credits
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <TransactionHistory transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
}