import React from "react";
import { CheckCircle, BarChart3, Users, TrendingUp, DollarSign, PieChart, Repeat, Grid2X2, UserCheck, Target, Clock, FileText, GraduationCap, Calculator, Shield, TrendingDown, AlertTriangle} from "lucide-react";
import Navbar from "@/components/landing/Navbar";

const bulletPoints = [
  {
    icon: TrendingUp,
    title: "Revenue Stream Analysis",
    description:
      "Break down revenue contributions from online courses, offline centers, and partnerships to identify growth opportunities and optimize your income channels."
  },
  {
    icon: TrendingDown,
    title: "Cost Management",
    description:
      "Monitor expenses across departments and centers to identify areas for cost reduction without compromising quality and maximize operational efficiency."
  },
  {
    icon: BarChart3,
    title: "Financial Forecasting",
    description:
      "Predict future revenues and expenses based on current trends, aiding in strategic planning and investment decisions for sustainable growth."
  },
  {
    icon: Shield,
    title: "Compliance Monitoring",
    description:
      "Ensure adherence to financial regulations and standards across all operations while maintaining transparency and accountability."
  },
  {
    icon: Calculator,
    title: "Budget Planning & Tracking",
    description:
      "Create detailed budgets and track performance against targets to maintain financial discipline and achieve strategic objectives."
  },
  {
    icon: PieChart,
    title: "Profitability Analysis",
    description:
      "Analyze profit margins across different business units and offerings to understand what drives your bottom line performance."
  },
  {
    icon: DollarSign,
    title: "Cash Flow Management",
    description:
      "Monitor cash inflows and outflows to ensure liquidity and optimize working capital for smooth business operations."
  },
  {
    icon: AlertTriangle,
    title: "Risk Assessment",
    description:
      "Identify financial risks and vulnerabilities early to implement mitigation strategies and protect your business stability."
  }
];

export default function Finance() {
  
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
        <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial Analytics Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Transform Your Financial Data into <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text"> Strategic Intelligence</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform converts complex financial data into clear, actionable insights, empowering you to make confident decisions that drive profitability and growth.
            </p>
          </div>

          {/* Subtitle Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Master Your Financial Performance</h2>
            <p className="text-md text-gray-600 max-w-5xl mx-auto leading-relaxed">
              Financial data holds the key to your business success, but it's often locked away in complex spreadsheets and reports. Our AI platform automatically processes your financial information, revealing the critical insights you need to optimize performance and accelerate growth.
            </p>
          </div>

          {/* Bullet Points Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Essential Financial Analytics Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {bulletPoints.map(({ icon: Icon, title, description }, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-white/50 rounded-xl transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Icon className="text-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
                    <p className="text-gray-600 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard Preview Image */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visualize Your Financial Health</h3>
                <p className="text-gray-600">Comprehensive dashboards that make financial data accessible and actionable</p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <img 
                    src="https://res.cloudinary.com/djbjfsshe/image/upload/v1748537766/hr_ppnxvj.jpg" 
                    alt="HR Dashboard Preview" 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* CTA Section */}
          <div className="text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">We Are Here to Help</h2>
              <p className=" max-w-3xl mx-auto mb-6 text-md">
                Financial management doesn't have to be complex. Whether you're planning for growth, need compliance support, or want to optimize your financial performance, our expert team is here to guide you every step of the way.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Ready to Take Control of Your Finances?</h3>
              <p className="max-w-xl mx-auto mb-8">
                Stop flying blind and start making informed financial decisions with complete confidence.
              </p>
              <button 
                onClick={() => window.location.href = '/demo-ai'}
                className="bg-white text-purple-600 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-purple-50 hover:scale-105 shadow-lg"
              >
                Get an Instant AI Analysis
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}