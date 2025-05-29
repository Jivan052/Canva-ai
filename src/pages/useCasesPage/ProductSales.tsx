import React from "react";
import { CheckCircle, BarChart3, Users, TrendingUp, DollarSign, PieChart, Repeat, Grid2X2, UserCheck} from "lucide-react";
import Navbar from "@/components/landing/Navbar";

const bulletPoints = [
  {
    icon: BarChart3,
    title: "Product Performance Analysis",
    description:
      "Identify your best-sellers and underperformers. Understand sales velocity and product-specific trends for better inventory and marketing decisions."
  },
  {
    icon: Users,
    title: "Customer Segmentation",
    description:
      "Group customers by behavior, location, and value for targeted campaigns that increase conversions and loyalty."
  },
  {
    icon: TrendingUp,
    title: "Channel Effectiveness",
    description:
      "See which channels bring in high-value customers so you can allocate budget confidently."
  },
  {
    icon: DollarSign,
    title: "Pricing & Trends Analysis",
    description:
      "Analyze how pricing impacts sales. Spot trends in your data to keep your pricing competitive and profitable."
  },
  {
    icon: PieChart,
    title: "Sales Funnel Analysis",
    description:
      "Visualize your sales funnel. Identify where customers drop off and fix leaks to improve conversion rates."
  },
  {
    icon: Repeat,
    title: "Customer Retention Rate Analysis",
    description:
      "Track churn and understand how loyalty programs impact repeat business."
  },
  {
    icon: Grid2X2,
    title: "Product Category Analysis",
    description:
      "Analyze product groups, not just individual items. Discover cross-sell and up-sell opportunities."
  },
  {
    icon: UserCheck,
    title: "Customer Lifetime Value (CLV) Analysis",
    description:
      "Find your VIPs. Focus retention marketing where it delivers the most financial impact."
  }
];

export default function ProductSales() {
  
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <section className="px-6 md:px-10 py-16 max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4 mr-2" />
              Sales Analytics Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Transform Your Sales Data into Your <br />
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text"> Biggest Asset</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform simplifies complex sales data, providing clear analysis on what matters most. Stop digging through spreadsheets and start driving growth.
            </p>
          </div>

          {/* Subtitle Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unlock a Complete View of Your Business Performance</h2>
            <p className="text-md text-gray-600 max-w-5xl mx-auto leading-relaxed">
              Raw sales data in spreadsheets is full of potential, but it's often trapped in a maze of rows and columns. Our AI platform automates the heavy lifting, instantly analyzing your sales information to reveal the critical insights you need to grow your business.
            </p>
          </div>

          {/* Bullet Points Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Key Analytics Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {bulletPoints.map(({ icon: Icon, title, description }, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 hover:bg-white/50 rounded-xl transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">See Your Data Come to Life</h3>
                <p className="text-gray-600">Interactive dashboards that make complex data simple to understand</p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center">
                  <img 
                    src="https://res.cloudinary.com/djbjfsshe/image/upload/v1748540394/prod_hbfv8d.jpg" 
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
                Navigating your data can be daunting, but you're not alone. Whether you're just starting out, need a question answered, or require expert guidance, our team is ready to assist.
              </p>
              <h3 className="text-2xl font-semibold mb-4">Ready to See Your Data in a New Light?</h3>
              <p className="max-w-xl mx-auto mb-8">
                Stop guessing and start making data-driven decisions with confidence.
              </p>
              <button 
                onClick={() => window.location.href = '/demo-ai'}
                className="bg-white text-blue-600 py-4 px-8 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-blue-50 hover:scale-105 shadow-lg"
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