import React from "react";
import {
  Banknote,
  LineChart,
  BarChart3,
  Receipt,
  FileBarChart,
  DollarSign,
  CreditCard,
  TrendingDown,
  ShieldCheck
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { Link } from "react-router-dom";

const bulletPoints = [
  {
    icon: Banknote,
    title: "Cash Flow Tracking",
    description:
      "Gain real-time insights into inflows and outflows. Understand your liquidity position instantly."
  },
  {
    icon: LineChart,
    title: "Budget vs. Actual Analysis",
    description:
      "Compare forecasts with actual spend to control costs and identify overspending areas quickly."
  },
  {
    icon: DollarSign,
    title: "Revenue & Expense Breakdown",
    description:
      "Drill into revenue streams and cost centers to spot patterns and areas for improvement."
  },
  {
    icon: CreditCard,
    title: "Accounts Payable & Receivable",
    description:
      "Monitor overdue invoices and upcoming payments. Improve cash collection cycles and vendor relationships."
  },
  {
    icon: FileBarChart,
    title: "Financial Ratios & KPIs",
    description:
      "Track margins, burn rate, profitability, and more — all in one place, updated in real-time."
  },
  {
    icon: Receipt,
    title: "Departmental Spend Visibility",
    description:
      "Understand where each team is spending. Hold departments accountable with clear data."
  },
  {
    icon: TrendingDown,
    title: "Cost Optimization Opportunities",
    description:
      "Identify inefficiencies and reduce unnecessary spend using AI-driven recommendations."
  },
  {
    icon: ShieldCheck,
    title: "Audit & Compliance Readiness",
    description:
      "Stay prepared for audits with centralized records, clean ledgers, and risk monitoring dashboards."
  }
];

export default function Finance() {
  return (
    <>
      <Navbar />
      <section className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Make Every Financial Decision Count
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered finance dashboards help you visualize burn, track cash flow, and improve fiscal control — no manual reports needed.
          </p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            See the Full Picture — From Spend to Strategy
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Get timely insights into your company’s financial health. Reduce waste, forecast smarter, and empower your finance team to lead with clarity.
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
            Finance Analytics That Drives Strategy
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Whether you’re fundraising, scaling, or cutting costs — our platform gives you financial clarity instantly, without hiring a full FP&A team.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Need board-ready visuals?</strong> Export dashboards as clean, executive-grade reports.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Stay compliant. Stay efficient. And make every dollar accountable.
          </p>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Get Control Over Your Financial Future
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Eliminate surprises with proactive finance insights. Empower your CFO and team to lead with data confidence.
          </p>
          <div className="flex justify-center mt-6">
            <Link to="/dashboard" className="inline-block">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:font-semibold">
                Launch Finance Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
