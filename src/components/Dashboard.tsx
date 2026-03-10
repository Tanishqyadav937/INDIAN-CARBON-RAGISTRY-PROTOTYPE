import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollReveal } from './ui/scroll-reveal';
import { NewProjectModal } from './NewProjectModal';
import { getApiUrl } from '../lib/api';
import { 
  Leaf, 
  LogOut, 
  TrendingUp, 
  Building, 
  Globe, 
  BarChart3,
  Plus,
  Eye,
  Settings,
  Bell,
  User,
  Award,
  TreePine,
  Activity,
  Database,
  AlertTriangle,
  Link,
  Clock
} from 'lucide-react';
import { Page, User as UserType } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user: UserType | null;
}

interface Project {
  _id: string;
  projectId: string;
  title: string;
  projectType: string;
  status: string;
  carbonCredits: {
    estimatedAnnual: number;
    generated: number;
    issued: number;
    traded: number;
    retired: number;
  };
  location: {
    state: string;
    district?: string;
  };
}

interface DashboardStats {
  totalProjects: number;
  totalCredits: number;
  tradedCredits: number;
  revenue: number;
}

export function Dashboard({ onNavigate, onLogout, user }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    totalCredits: 0,
    tradedCredits: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Fetch real data from API
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      const apiUrl = getApiUrl();

      // Fetch user projects - use my-projects endpoint for user-specific data
      const projectsResponse = await fetch(`${apiUrl}/api/projects/my-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.data?.projects || []);
      }

      // Fetch dashboard stats
      const statsResponse = await fetch(`${apiUrl}/api/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data || {
          totalProjects: 0,
          totalCredits: 0,
          tradedCredits: 0,
          revenue: 0
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [user]); // Add user as dependency to prevent race condition

  // Handle project creation
  const handleCreateProject = async (projectData: any) => {
    setIsCreatingProject(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        // Refetch dashboard data to update the display
        await fetchDashboardData();
        setShowNewProjectModal(false);
      } else {
        const error = await response.json();
        console.error('Error creating project:', error.message);
        // You might want to show an error toast here
      }
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Active': { color: 'bg-tea-green-50 text-tea-green-100 border-tea-green-200', icon: Activity },
      'Under Review': { color: 'bg-buff-50 text-buff-500 border-buff-200', icon: Eye },
      'Verified': { color: 'bg-papaya-whip-50 text-papaya-whip-300 border-papaya-whip-200', icon: Award },
      'Pending': { color: 'bg-beige-50 text-beige-300 border-beige-200', icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.color} border rounded-2xl px-3 py-1 text-sm font-medium`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tea-green-50 via-beige-50 to-cornsilk-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(204,213,174,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(233,237,201,0.06),transparent_60%)]"></div>
        <div className="relative text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-tea-green-100 mx-auto"></div>
          <p className="mt-6 text-tea-green-200 font-light text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tea-green-50 via-beige-50 to-cornsilk-50">
      {/* Top Navigation */}
      <nav className="bg-background/90 backdrop-blur-xl border-b border-tea-green-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-tea-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-display font-medium text-foreground">India Carbon Registry</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-tea-green-200 hover:text-foreground">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-tea-green-200 hover:text-foreground">
                <Settings className="h-5 w-5" />
              </Button>
              
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-tea-green-100 rounded-2xl flex items-center justify-center text-white text-base font-medium shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-tea-green-200 capitalize">{user.role}</div>
                  </div>
                </div>
              )}

              <Button variant="ghost" size="sm" onClick={onLogout} className="text-tea-green-200 hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-16">
          <ScrollReveal direction="up" distance={20} delay={100}>
            <h1 className="text-4xl sm:text-5xl font-display font-light text-foreground mb-4">
              Welcome back, <span className="text-tea-green-100">{user?.name}</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal direction="up" distance={25} delay={200}>
            <p className="text-xl text-tea-green-200 font-light leading-relaxed">
              Here's an overview of your carbon registry activities and blockchain ledger
            </p>
          </ScrollReveal>
        </div>

        {/* Upcoming Features Alert */}
        <ScrollReveal direction="up" distance={30} delay={300}>
          <div className="mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-buff-200 shadow-premium-lg">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-buff-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-medium text-foreground mb-2">Upcoming Features</h3>
                    <p className="text-tea-green-200 leading-relaxed font-light">
                      Advanced blockchain ledger visualization, real-time carbon credit trading, and AI-powered analytics are coming soon. 
                      Stay tuned for these premium features that will revolutionize carbon credit management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <ScrollReveal direction="up" distance={40} delay={100}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-tea-green-200 hover:shadow-premium-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-tea-green-100 rounded-2xl flex items-center justify-center">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-medium text-foreground">{stats.totalProjects}</div>
                    <div className="text-sm text-tea-green-200 font-medium">Total Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={40} delay={200}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-buff-200 hover:shadow-premium-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-buff-500 rounded-2xl flex items-center justify-center">
                    <TreePine className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-medium text-foreground">{stats.totalCredits.toLocaleString()}</div>
                    <div className="text-sm text-tea-green-200 font-medium">Carbon Credits</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={40} delay={300}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-papaya-whip-300 to-papaya-whip-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-papaya-whip-200 hover:shadow-premium-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-papaya-whip-300 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-medium text-foreground">{stats.tradedCredits}</div>
                    <div className="text-sm text-tea-green-200 font-medium">Credits Traded</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={40} delay={400}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-beige-300 to-beige-400 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-3xl p-8 border border-beige-200 hover:shadow-premium-xl transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-beige-300 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-display font-medium text-foreground">₹{(stats.revenue / 100000).toFixed(1)}L</div>
                    <div className="text-sm text-tea-green-200 font-medium">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Projects Section - Takes full width until sidebar */}
          <div className="lg:col-span-3">
            <ScrollReveal direction="up" distance={40} delay={500}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-tea-green-200 shadow-premium-lg">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-display font-medium text-foreground mb-2">Your Projects</h2>
                      <p className="text-tea-green-200 font-light">
                        Manage and track your carbon credit projects
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-tea-green-100 hover:bg-tea-green-200 text-white rounded-2xl px-6 py-3 shadow-lg"
                      onClick={() => setShowNewProjectModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>
                  
                  {projects.length > 0 ? (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project._id} className="border border-tea-green-200 rounded-2xl p-6 hover:bg-tea-green-50 transition-all duration-300 hover:shadow-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-display font-medium text-foreground">{project.title}</h3>
                              <p className="text-sm text-tea-green-200">
                                {project.projectId} • {project.location.state}
                              </p>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-6 text-sm">
                            <div>
                              <span className="text-tea-green-200 font-medium">Type:</span>
                              <p className="font-medium text-foreground mt-1">{project.projectType}</p>
                            </div>
                            <div>
                              <span className="text-tea-green-200 font-medium">Credits Issued:</span>
                              <p className="font-medium text-foreground mt-1">{project.carbonCredits.issued}</p>
                            </div>
                            <div>
                              <span className="text-tea-green-200 font-medium">Credits Traded:</span>
                              <p className="font-medium text-foreground mt-1">{project.carbonCredits.traded}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end mt-4">
                            <Button variant="outline" size="sm" className="border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-tea-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Building className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-display font-medium text-foreground mb-3">No projects yet</h3>
                      <p className="text-tea-green-200 mb-6 font-light">Get started by registering your first carbon project</p>
                      <Button 
                        className="bg-tea-green-100 hover:bg-tea-green-200 text-white rounded-2xl px-8 py-3 shadow-lg"
                        onClick={() => setShowNewProjectModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Register First Project
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Blockchain Ledger */}
            <ScrollReveal direction="left" distance={40} delay={600}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-buff-200 shadow-premium-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-buff-500 rounded-2xl flex items-center justify-center">
                      <Link className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-medium text-foreground">Blockchain Ledger</h3>
                      <p className="text-sm text-tea-green-200 font-light">Live transaction history</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-buff-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-buff-500 rounded-xl flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Block #1,234</p>
                          <p className="text-xs text-tea-green-200">2 min ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">+150 Credits</p>
                        <p className="text-xs text-tea-green-200">Solar Project</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-buff-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-buff-500 rounded-xl flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Block #1,233</p>
                          <p className="text-xs text-tea-green-200">5 min ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">+75 Credits</p>
                        <p className="text-xs text-tea-green-200">Forest Project</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-buff-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-buff-500 rounded-xl flex items-center justify-center">
                          <Database className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Block #1,232</p>
                          <p className="text-xs text-tea-green-200">8 min ago</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">-25 Credits</p>
                        <p className="text-xs text-tea-green-200">Traded</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-buff-200">
                    <Button variant="outline" className="w-full border-buff-200 text-buff-500 hover:bg-buff-50 rounded-2xl">
                      <Database className="h-4 w-4 mr-2" />
                      View Full Ledger
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Quick Actions */}
            <ScrollReveal direction="left" distance={40} delay={700}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-papaya-whip-300 to-papaya-whip-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-papaya-whip-200 shadow-premium-lg">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-papaya-whip-300 rounded-2xl flex items-center justify-center">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-medium text-foreground">Quick Actions</h3>
                      <p className="text-sm text-tea-green-200 font-light">Common tasks</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl"
                      onClick={() => setShowNewProjectModal(true)}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Register New Project
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl">
                      <BarChart3 className="h-4 w-4 mr-3" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl">
                      <TrendingUp className="h-4 w-4 mr-3" />
                      Trading Platform
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl">
                      <Globe className="h-4 w-4 mr-3" />
                      Browse Registry
                    </Button>
                    <Button variant="outline" className="w-full justify-start border-tea-green-200 text-tea-green-100 hover:bg-tea-green-50 rounded-2xl">
                      <User className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Achievement Card */}
            <ScrollReveal direction="left" distance={40} delay={800}>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-beige-300 to-beige-400 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-beige-200 shadow-premium-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-beige-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-medium text-foreground mb-2">Green Pioneer</h3>
                    <p className="text-sm text-tea-green-200 font-light leading-relaxed">
                      Welcome to India Carbon Registry! You're helping build a sustainable future.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-16 flex justify-center">
          <ScrollReveal direction="up" distance={20} delay={900}>
            <Button
              variant="outline"
              onClick={() => onNavigate('landing')}
              className="border-2 border-tea-green-200 hover:bg-tea-green-50 text-tea-green-100 px-8 py-3 rounded-2xl font-medium transition-all duration-300"
            >
              ← Back to Home
            </Button>
          </ScrollReveal>
        </div>
      </div>

      {/* Project Creation Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreateProject={handleCreateProject}
          isCreating={isCreatingProject}
        />
      )}
    </div>
  );
}
