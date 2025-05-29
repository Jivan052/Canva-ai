import React from "react";
import { CheckCircle, BarChart3, Users, TrendingUp, DollarSign, PieChart, Repeat, Grid2X2, UserCheck, Target, Clock, FileText, GraduationCap, Calculator, Shield, TrendingDown, AlertTriangle, Megaphone, Star, Video, MapPin} from "lucide-react";
import Navbar from "@/components/landing/Navbar";

const bulletPoints = [
  {
    icon: Target,
    title: "Campaign Performance Analysis",
    description:
      "Evaluate ROI across various channels to identify the most effective platforms for student acquisition and maximize your marketing investment."
  },
  {
    icon: Star,
    title: "Influencer Impact Assessment",
    description:
      "Measure the effectiveness of collaborations with over 2,000 micro-influencers by tracking engagement metrics and conversion rates for optimal partnerships."
  },
  {
    icon: Video,
    title: "Content Strategy Optimization",
    description:
      "Analyze student engagement with different content types to refine content strategies and improve retention across all marketing channels."
  },
  {
    icon: MapPin,
    title: "Regional Demand Forecasting",
    description:
      "Predict demand for courses in different regions, aiding in targeted marketing and resource allocation for maximum market penetration."
  },
  {
    icon: BarChart3,
    title: "Attribution Modeling",
    description:
      "Track the complete customer journey across touchpoints to understand which marketing activities drive conversions and optimize budget allocation."
  },
  {
    icon: Users,
    title: "Audience Segmentation",
    description:
      "Segment your audience based on behavior, demographics, and preferences to create highly targeted campaigns that resonate with each group."
  },
  {
    icon: TrendingUp,
    title: "Lead Quality Scoring",
    description:
      "Evaluate lead quality across different channels and campaigns to focus efforts on sources that generate high-converting prospects."
  },
  {
    icon: Repeat,
    title: "Marketing Automation Insights",
    description:
      "Analyze automated campaign performance and user engagement to optimize email sequences, nurture campaigns, and retention strategies."
  }
];

export default function Marketing() {
  
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
        <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4 mr-2" />
              Marketing Analytics Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Turn Your Marketing Data into <br />
              <span className="text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text"> Growth Acceleration</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform transforms complex marketing data into clear insights, helping you optimize campaigns, maximize ROI, and drive sustainable student acquisition and engagement.
            </p>
          </div>

          {/* Subtitle Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amplify Your Marketing Impact</h2>
            <p className="text-md text-gray-600 max-w-5xl mx-auto leading-relaxed">
              Marketing data from multiple channels creates a complex puzzle, but the insights within drive growth. Our AI platform connects all your marketing touchpoints, automatically analyzing performance to reveal the strategies that convert prospects into loyal students.
            </p>
          </div>

          {/* Bullet Points Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Powerful Marketing Analytics Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {bulletPoints.map(({ icon: Icon, title, description }, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-white/50 rounded-xl transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Visualize Your Marketing Success</h3>
                <p className="text-gray-600">Dynamic dashboards that make campaign performance crystal clear</p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Megaphone className="w-24 h-24 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg font-medium">Interactive Marketing Dashboard</p>
                  <p className="text-slate-400 text-sm">Real-time campaign analytics and insights</p>
                </div>
              </div>
            </div>
          </div>


          {/* CTA Section */}
          <div className="text-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">We Are Here to Help</h2>
              <p className=" max-w-3xl mx-auto mb-6 text-md">
                Marketing success shouldn't be left to guesswork. Whether you're launching new campaigns, optimizing existing strategies, or scaling your student acquisition efforts, our expert team is ready to help you achieve breakthrough results.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Ready to Supercharge Your Marketing ROI?</h3>
              <p className="max-w-xl mx-auto mb-8">
                Stop wasting ad spend and start driving predictable, profitable growth with data-driven marketing.
              </p>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-white text-orange-600 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-orange-50 hover:scale-105 shadow-lg"
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