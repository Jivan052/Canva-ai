import React from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Megaphone,
  UserCheck,
  Eye,
  ThumbsUp,
  Globe,
  Link2,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { Link } from "react-router-dom";

const bulletPoints = [
  {
    icon: TrendingUp,
    title: "Campaign ROI Analysis",
    description:
      "Track which marketing campaigns deliver the highest return on investment and double down on what works."
  },
  {
    icon: PieChart,
    title: "Channel Performance Breakdown",
    description:
      "Compare email, social, SEO, and paid channels to understand where your most engaged users come from."
  },
  {
    icon: Megaphone,
    title: "Ad Spend Optimization",
    description:
      "See where ad dollars are being wasted and reallocate budget to high-performing campaigns automatically."
  },
  {
    icon: UserCheck,
    title: "Audience Segmentation",
    description:
      "Segment customers by engagement, geography, or demographics to personalize your messaging."
  },
  {
    icon: Eye,
    title: "Impression & Reach Analytics",
    description:
      "Measure your visibility across platforms to see how far your message is spreading."
  },
  {
    icon: ThumbsUp,
    title: "Engagement & Conversion Analysis",
    description:
      "Identify which content resonates most with your audience and drives the most conversions."
  },
  {
    icon: Globe,
    title: "Traffic Source Insights",
    description:
      "Analyze organic, direct, referral, and paid traffic to better allocate resources."
  },
  {
    icon: Link2,
    title: "Customer Journey Mapping",
    description:
      "Visualize how users move from awareness to action across multiple touchpoints."
  }
];

export default function Marketing() {
  return (
    <>
      <Navbar />
      <section className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Unlock Smarter Marketing Decisions with Data
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform reveals what’s working—and what isn’t—so you can focus on driving measurable marketing results.
          </p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Eliminate Guesswork from Your Marketing Strategy
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Raw marketing data is full of insight—but it’s often buried in spreadsheets and dashboards. Our tools bring clarity to your campaigns in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bulletPoints.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 transition-transform duration-300 hover:shadow-xl hover:scale-[1.02] group"
            >
              <Icon className="text-blue-600 w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:font-bold transition duration-300">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-6 md:p-10 text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Marketing Intelligence with a Human Edge
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            AI helps you act faster, but human experts help you act smarter. We tailor your marketing data to align with your business goals.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Need campaign-specific insights?</strong> Our analysts will dive into the details and help refine your strategy.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Custom dashboard setup?</strong> We’ll configure reports that show what you need to see—no more, no less.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Combine the power of automation with the insight of real humans for game-changing marketing performance.
          </p>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Outperform Your Competition?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Don’t settle for vanity metrics. Use AI to drive actual growth, real conversions, and better ROI.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Let the Data Tell You What Works
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Focus on strategies that bring results—backed by intelligent analysis.
          </p>
          <div className="flex justify-center mt-6">
            <Link to="/dashboard" className="inline-block">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:font-semibold">
                Start Your Marketing Audit
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
