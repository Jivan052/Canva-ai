import React from "react";
import { CheckCircle, BarChart3, Users, TrendingUp, DollarSign, PieChart, Repeat, Grid2X2, UserCheck } from "lucide-react";
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
        <section className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">Transform Your Sales Data into Your Biggest Asset</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform simplifies complex sales data, providing clear analysis on what matters most. Stop digging through spreadsheets and start driving growth.
            </p>
        </div>

        <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Unlock a Complete View of Your Business Performance</h2>
            <p className="text-gray-600 max-w-4xl mx-auto">
            Raw sales data in spreadsheets is full of potential, but it's often trapped in a maze of rows and columns. Our AI platform automates the heavy lifting, instantly analyzing your sales information to reveal the critical insights you need to grow your business.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bulletPoints.map(({ icon: Icon, title, description }, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition duration-300">
                <Icon className="text-blue-600 w-8 h-8 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
            ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-6 md:p-10 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">The Human Touch: Our Unique Hybrid Approach</h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Standard AI tools are powerful, but they offer a one-size-fits-all solution. Your business is unique, and so is your data.
            </p>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Need Customization?</strong> We manually adjust and prepare your sheets to ensure they are perfectly optimized for AI analysis.
            </p>
            <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Need a Deeper Dive?</strong> Our data specialists provide custom analysis and reports to answer your specific questions.
            </p>
            <p className="text-gray-700 max-w-3xl mx-auto">
            With us, you get the best of both worlds: the speed of AI and the insight of a human expert.
            </p>
        </div>

        <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">We Are Here to Help</h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Navigating your data can be daunting, but you're not alone. Whether you're just starting out, need a question answered, or require expert guidance, our team is ready to assist.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to See Your Data in a New Light?</h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Stop guessing and start making data-driven decisions with confidence.
            </p>
            <button className="bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition duration-300">
            Get an Instant AI Analysis
            </button>
        </div>
        </section>
    </>
  );
}
