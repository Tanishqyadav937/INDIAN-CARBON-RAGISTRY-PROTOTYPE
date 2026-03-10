import { Button } from './ui/button';
import { ScrollReveal } from './ui/scroll-reveal';
import { 
  Leaf, 
  Shield, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Globe, 
  Award, 
  TreePine,
  ArrowRight,
  Building2,
  Lock,
  Play,
  Database,
  Activity,
  ChevronRight
} from 'lucide-react';
import { Page, User } from '../App';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  user: User | null;
}

export function LandingPage({ onNavigate, isLoggedIn, onLogout, user }: LandingPageProps) {

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/90 backdrop-blur-xl border-b border-tea-green-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-tea-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-display font-medium text-foreground">India Carbon Registry</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-12">
              <a href="#features" className="text-tea-green-200 hover:text-foreground transition-colors text-base font-medium relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tea-green-100 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#stats" className="text-tea-green-200 hover:text-foreground transition-colors text-base font-medium relative group">
                Benefits
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tea-green-100 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="text-tea-green-200 hover:text-foreground transition-colors text-base font-medium relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tea-green-100 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="text-tea-green-200 hover:text-foreground transition-colors text-base font-medium relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-tea-green-100 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn && user ? (
                <>
                  <Button variant="outline" onClick={() => onNavigate('dashboard')} className="border-2 border-tea-green-200 hover:bg-tea-green-50 px-6 py-3 text-base font-medium">
                    Dashboard
                  </Button>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-tea-green-100 rounded-2xl flex items-center justify-center text-white text-base font-medium shadow-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-base text-tea-green-200 font-medium">{user.name}</span>
                  </div>
                  <Button variant="ghost" onClick={onLogout} className="text-tea-green-200 hover:text-foreground px-6 py-3 text-base font-medium">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => onNavigate('login')} className="text-tea-green-200 hover:text-foreground px-6 py-3 text-base font-medium">
                    Login
                  </Button>
                  <Button onClick={() => onNavigate('signup')} className="bg-tea-green-100 hover:bg-tea-green-200 text-white px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-tea-green-50 via-beige-50 to-cornsilk-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(204,213,174,0.08),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(233,237,201,0.06),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-10">
                <ScrollReveal direction="up" distance={20} delay={100}>
                  <div className="inline-flex items-center space-x-3 bg-tea-green-100 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg">
                    <Building2 className="h-4 w-4" />
                    <span>Web3 Blockchain Innovation</span>
                  </div>
                </ScrollReveal>
              
              <ScrollReveal direction="up" distance={30} delay={200} duration={1}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-title font-light text-foreground leading-[0.9] text-balance">
                  India's Carbon
                  <span className="text-tea-green-100"> Registry</span>
                </h1>
              </ScrollReveal>
              
                <ScrollReveal direction="up" distance={25} delay={300}>
                  <p className="text-lg sm:text-xl text-tea-green-200 leading-relaxed max-w-2xl font-light">
                    The next-generation platform for blue carbon credit tokenization, verification, and trading. 
                    Built on Web3 blockchain technology for transparent and decentralized carbon markets.
                  </p>
                </ScrollReveal>
              
              <ScrollReveal direction="up" distance={20} delay={400}>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <Button 
                    size="lg" 
                    onClick={() => onNavigate('signup')} 
                    className="bg-tea-green-100 hover:bg-tea-green-200 text-white px-8 sm:px-10 py-4 sm:py-5 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                  >
                    Tokenize Credits
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => onNavigate('dashboard')}
                    className="border-2 border-tea-green-200 hover:bg-tea-green-50 text-tea-green-100 px-8 sm:px-10 py-4 sm:py-5 text-base font-medium transition-all duration-300 w-full sm:w-auto"
                  >
                    <Play className="mr-3 h-4 w-4" />
                    View Demo
                  </Button>
                </div>
              </ScrollReveal>
              
              {/* Quick Access Features */}
              <ScrollReveal direction="up" distance={20} delay={500}>
                <div className="flex flex-wrap gap-6 pt-8">
                  <div className="flex items-center space-x-3 text-tea-green-200 hover:text-tea-green-100 transition-colors cursor-pointer group">
                    <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Trading Platform</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center space-x-3 text-tea-green-200 hover:text-tea-green-100 transition-colors cursor-pointer group">
                    <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">View Analytics</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center space-x-3 text-tea-green-200 hover:text-tea-green-100 transition-colors cursor-pointer group">
                    <Database className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Browse Registry</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </ScrollReveal>
            </div>
            
            {/* Feature Highlights */}
            <div className="relative mt-12 lg:mt-0">
              <div className="grid grid-cols-2 gap-6 sm:gap-8">
                <ScrollReveal direction="left" distance={30} delay={500}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-premium-lg border border-tea-green-200 group-hover:shadow-premium-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-tea-green-100 rounded-2xl flex items-center justify-center">
                          <TreePine className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-display font-medium text-foreground">Project Registration</div>
                          <div className="text-sm text-tea-green-200 font-medium">Streamlined Process</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal direction="right" distance={30} delay={600}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-premium-lg border border-buff-200 group-hover:shadow-premium-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-buff-500 rounded-2xl flex items-center justify-center">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-display font-medium text-foreground">Nationwide Coverage</div>
                          <div className="text-sm text-tea-green-200 font-medium">All States Supported</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal direction="left" distance={30} delay={700}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-papaya-whip-300 to-papaya-whip-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-premium-lg border border-papaya-whip-200 group-hover:shadow-premium-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-papaya-whip-300 rounded-2xl flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-display font-medium text-foreground">Blue Carbon Credits</div>
                          <div className="text-sm text-tea-green-200 font-medium">Blockchain Verified</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal direction="right" distance={30} delay={800}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-beige-300 to-beige-400 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                    <div className="relative bg-white rounded-3xl p-8 shadow-premium-lg border border-beige-200 group-hover:shadow-premium-xl transition-all duration-300">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-beige-300 rounded-2xl flex items-center justify-center">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-display font-medium text-foreground">Multi-stakeholder</div>
                          <div className="text-sm text-tea-green-200 font-medium">Open Platform</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section id="stats" className="py-32 bg-gradient-to-br from-tea-green-50 to-beige-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <ScrollReveal direction="up" distance={30} duration={0.8}>
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 bg-tea-green-100 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                <Activity className="h-4 w-4" />
                <span>Platform Benefits</span>
              </div>
              <h2 className="text-5xl font-display font-light text-foreground mb-8">
                Why Choose Our Platform
              </h2>
              <p className="text-xl text-tea-green-200 max-w-3xl mx-auto leading-relaxed font-light">
                Built for the future of carbon markets with Web3 blockchain technology and decentralized verification
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            <ScrollReveal direction="up" distance={40} delay={100}>
              <div className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-10 border border-tea-green-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-tea-green-300">
                    <div className="text-2xl font-display font-medium text-foreground mb-4">Transparent</div>
                    <div className="text-tea-green-200 font-medium">Pricing & Trading</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" distance={40} delay={200}>
              <div className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-10 border border-buff-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-buff-300">
                    <div className="text-2xl font-display font-medium text-foreground mb-4">Secure</div>
                    <div className="text-tea-green-200 font-medium">Blockchain Technology</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" distance={40} delay={300}>
              <div className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-papaya-whip-300 to-papaya-whip-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-10 border border-papaya-whip-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-papaya-whip-300">
                    <div className="text-2xl font-display font-medium text-foreground mb-4">Decentralized</div>
                    <div className="text-tea-green-200 font-medium">Smart Contract Verification</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" distance={40} delay={400}>
              <div className="text-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-beige-300 to-beige-400 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-white rounded-3xl p-10 border border-beige-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-beige-300">
                    <div className="text-2xl font-display font-medium text-foreground mb-4">Real-time</div>
                    <div className="text-tea-green-200 font-medium">Monitoring & Analytics</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-gradient-to-br from-beige-50 to-cornsilk-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <ScrollReveal direction="up" distance={30} duration={0.8}>
            <div className="text-center mb-24">
              <div className="inline-flex items-center space-x-3 bg-tea-green-100 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                <Award className="h-4 w-4" />
                <span>World-Class Platform</span>
              </div>
              <h2 className="text-5xl font-display font-light text-foreground mb-8">
                India Carbon Registry
              </h2>
              <p className="text-xl text-tea-green-200 max-w-3xl mx-auto leading-relaxed font-light">
                Built for the future of blue carbon markets with blockchain tokenization, 
                real-time monitoring, and decentralized trading mechanisms.
              </p>
            </div>
          </ScrollReveal>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            <ScrollReveal direction="up" distance={40} delay={100}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-tea-green-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-tea-green-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-tea-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-tea-green-200 transition-colors shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">Blockchain Registry System</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Decentralized verification system ensuring authenticity of all blue carbon credits with Web3 blockchain security
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-tea-green-50 to-beige-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GfVTvO9XsAAEHyM.jpeg" 
                      alt="Blockchain Registry System" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={200}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-buff-500 to-buff-600 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-buff-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-buff-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-buff-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-buff-600 transition-colors shadow-lg">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">Real-time Analytics</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Live monitoring and reporting of blue carbon emissions and credit tokenization with blockchain analytics and AI insights
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-buff-50 to-papaya-whip-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GfVTvsxXYAAg4zb.jpeg" 
                      alt="Real-time Analytics" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={300}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-papaya-whip-300 to-papaya-whip-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-papaya-whip-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-papaya-whip-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-papaya-whip-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-papaya-whip-400 transition-colors shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">DeFi Trading Platform</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Decentralized marketplace for trading tokenized blue carbon credits with automated price discovery and smart contracts
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-papaya-whip-50 to-cornsilk-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GfVTwlUWUAEyVcG.jpeg" 
                      alt="DeFi Trading Platform" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={400}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-beige-300 to-beige-400 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-beige-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-beige-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-beige-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-beige-400 transition-colors shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">State-wise Tracking</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Comprehensive coverage across all 28 Indian states with localized carbon accounting and regional insights
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-beige-50 to-tea-green-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GqH63QyW0AEoqqd.jpeg" 
                      alt="State-wise Tracking" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={500}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cornsilk-300 to-cornsilk-400 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-cornsilk-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-cornsilk-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-cornsilk-300 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cornsilk-400 transition-colors shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">Multi-stakeholder Platform</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Supporting corporates, NGOs, government bodies, and individual project developers in their carbon journey
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-cornsilk-50 to-papaya-whip-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GfVTvO9XsAAEHyM.jpeg" 
                      alt="Multi-stakeholder Platform" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={40} delay={600}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-tea-green-100 to-tea-green-200 rounded-3xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-3xl p-8 border border-tea-green-200 hover:shadow-premium-xl transition-all duration-300 group-hover:border-tea-green-300 h-full flex flex-col">
                  <div className="w-16 h-16 bg-tea-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-tea-green-200 transition-colors shadow-lg">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-medium text-foreground mb-4">International Compliance</h3>
                  <p className="text-tea-green-200 leading-relaxed font-light flex-grow">
                    Aligned with international standards and India's regulatory framework for global carbon credit recognition
                  </p>
                  <div className="mt-6 h-32 bg-gradient-to-br from-tea-green-50 to-beige-50 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/images/GfVTvsxXYAAg4zb.jpeg" 
                      alt="International Compliance" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-tea-green-100 to-tea-green-200 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 text-center">
          <ScrollReveal direction="up" distance={30} duration={0.8}>
            <h2 className="text-5xl lg:text-6xl font-display font-light mb-8 leading-tight">
              Ready to Register Your
              <span className="block text-cornsilk-50">Carbon Project?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal direction="up" distance={25} delay={200}>
            <p className="text-xl text-tea-green-50 mb-16 leading-relaxed max-w-3xl mx-auto font-light">
              Join India's largest carbon registry platform and contribute to our net-zero goals.
              Get started today and make a difference for tomorrow.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" distance={20} delay={400}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => onNavigate('signup')}
                className="bg-white text-tea-green-100 hover:bg-cornsilk-50 px-12 py-6 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Start Registration
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('login')}
                className="border-2 border-tea-green-100 bg-tea-green-100 text-white hover:bg-white hover:text-tea-green-100 px-12 py-6 text-lg font-medium transition-all duration-300"
              >
                <Play className="mr-3 h-5 w-5" />
                View Demo
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-tea-green-100 to-tea-green-200 text-tea-green-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.05),transparent_60%)]"></div>
        <div className="relative max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="h-6 w-6 text-tea-green-100" />
                </div>
                <span className="text-xl font-display font-medium text-white">India Carbon Registry</span>
              </div>
              <p className="text-tea-green-50 leading-relaxed font-light text-lg">
                Official platform for carbon credit registration and trading in India.
                Building a sustainable future together.
              </p>
            </div>
            
            <div>
              <h3 className="font-display font-medium text-white mb-8 text-lg">Platform</h3>
              <div className="space-y-6 text-tea-green-50">
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Register Projects</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Trade Credits</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>View Analytics</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Verification</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display font-medium text-white mb-8 text-lg">Support</h3>
              <div className="space-y-6 text-tea-green-50">
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Documentation</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Help Center</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Contact Us</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Status</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-display font-medium text-white mb-8 text-lg">Government</h3>
              <div className="space-y-6 text-tea-green-50">
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Ministry of Environment</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Carbon Policy</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Regulatory Framework</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="hover:text-white transition-colors cursor-pointer font-light text-lg flex items-center space-x-2 group">
                  <span>Official Guidelines</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-tea-green-200 mt-20 pt-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-tea-green-50 text-lg font-light">
                Hackathon Project - India Carbon Registry
              </p>
              <p className="text-tea-green-50 text-lg font-light mt-4 md:mt-0">
                Built for India's Carbon Neutral Future
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
