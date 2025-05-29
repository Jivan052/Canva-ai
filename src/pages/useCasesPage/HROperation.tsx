import React from "react";
import { CheckCircle, BarChart3, Users, TrendingUp, DollarSign, PieChart, Repeat, Grid2X2, UserCheck, Target, Clock, FileText, GraduationCap} from "lucide-react";
import Navbar from "@/components/landing/Navbar";

const bulletPoints = [
  {
    icon: BarChart3,
    title: "Workforce Analytics",
    description:
      "Track employee performance, turnover rates, and satisfaction levels to inform HR strategies and make data-driven decisions about your workforce."
  },
  {
    icon: Target,
    title: "Recruitment Optimization",
    description:
      "Analyze hiring processes to reduce time-to-hire and improve candidate quality. Streamline your recruitment funnel for better results."
  },
  {
    icon: DollarSign,
    title: "Payroll Management",
    description:
      "Automate payroll processing and compliance checks to ensure accuracy and adherence to regulations while reducing administrative overhead."
  },
  {
    icon: GraduationCap,
    title: "Training and Development",
    description:
      "Assess the effectiveness of training programs and identify areas for employee skill enhancement to maximize your learning investment."
  },
  {
    icon: Users,
    title: "Employee Engagement Analysis",
    description:
      "Monitor engagement metrics and identify factors that drive employee satisfaction and retention across your organization."
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description:
      "Analyze individual and team performance patterns to identify top performers and areas needing improvement."
  },
  {
    icon: Clock,
    title: "Attendance & Time Management",
    description:
      "Track attendance patterns, overtime trends, and time allocation to optimize workforce scheduling and productivity."
  },
  {
    icon: FileText,
    title: "Compliance Monitoring",
    description:
      "Stay on top of HR compliance requirements and track adherence to labor laws and company policies."
  }
];

export default function HROperations() {
  
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50">
        <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-6">
              <Users className="w-4 h-4 mr-2" />
              HR Analytics Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Turn Your HR Data into Your <br />
              <span className="text-transparent bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text"> Strategic Advantage</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform transforms complex HR data into actionable insights, helping you make smarter decisions about your most valuable asset - your people.
            </p>
          </div>

          {/* Subtitle Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock the Full Potential of Your Workforce</h2>
            <p className="text-md text-gray-600 max-w-5xl mx-auto leading-relaxed">
              HR data scattered across systems tells a story, but it's often buried in complexity. Our AI platform brings everything together, automatically analyzing your workforce information to reveal the strategic insights you need to build a thriving organization.
            </p>
          </div>

          {/* Bullet Points Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Core HR Analytics Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {bulletPoints.map(({ icon: Icon, title, description }, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-white/50 rounded-xl transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visualize Your HR Insights</h3>
                <p className="text-gray-600">Comprehensive dashboards that make workforce data easy to understand</p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Users className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">Interactive HR Dashboard</p>
                  <p className="text-slate-400 text-sm">Real-time workforce analytics and insights</p>
                </div>
              </div>
            </div>
          </div>


          {/* CTA Section */}
          <div className="text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">We Are Here to Help</h2>
              <p className=" max-w-3xl mx-auto mb-6 text-md">
                Managing HR data doesn't have to be overwhelming. Whether you're implementing new processes, need expert guidance, or want to optimize your current operations, our team is ready to support you.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Ready to Transform Your HR Operations?</h3>
              <p className="max-w-xl mx-auto mb-8">
                Stop managing in the dark and start making strategic HR decisions with confidence.
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-green-600 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-green-50 hover:scale-105 shadow-lg"
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