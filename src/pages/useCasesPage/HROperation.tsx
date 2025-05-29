import React from "react";
import {
  UserCheck,
  Users,
  BarChart3,
  Clock,
  ClipboardCheck,
  ShieldCheck,
  Briefcase,
  Medal,
  FileText,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import { Link } from "react-router-dom";

const bulletPoints = [
  {
    icon: Users,
    title: "Employee Segmentation",
    description:
      "Group employees based on performance, department, or experience to tailor training and development initiatives."
  },
  {
    icon: Clock,
    title: "Attendance & Shift Analytics",
    description:
      "Track patterns in attendance, lateness, and shift preferences for more efficient workforce scheduling."
  },
  {
    icon: ClipboardCheck,
    title: "Hiring Funnel Insights",
    description:
      "Analyze hiring data to find bottlenecks and improve the speed and quality of talent acquisition."
  },
  {
    icon: UserCheck,
    title: "Onboarding Experience Analysis",
    description:
      "Measure how onboarding affects new hire success, engagement, and retention over time."
  },
  {
    icon: Briefcase,
    title: "Department-Level Productivity",
    description:
      "Understand how different departments perform to better allocate resources and set realistic goals."
  },
  {
    icon: FileText,
    title: "Policy Compliance Tracking",
    description:
      "Monitor adherence to HR policies, safety standards, and regulatory requirements."
  },
  {
    icon: ShieldCheck,
    title: "Employee Satisfaction & Risk Detection",
    description:
      "Identify employee dissatisfaction trends before they lead to turnover or productivity issues."
  },
  {
    icon: Medal,
    title: "Training Impact Assessment",
    description:
      "Measure how training programs improve employee performance and engagement."
  }
];

export default function HROperations() {
  return (
    <>
      <Navbar />
      <section className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Turn HR Data Into Strategic Business Decisions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform helps HR teams unlock actionable insights from employee and organizational data to boost performance and retention.
          </p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Empower Your People Strategy with AI Insights
          </h2>
          <p className="text-gray-600 max-w-4xl mx-auto">
            Say goodbye to spreadsheet overwhelm. Our tools surface critical HR trends that help you make better workforce decisions—faster.
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
            Human-Centric + Data-Driven = Smarter HR
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Traditional HR tools focus on compliance. We focus on **impact**. Use real-time insights to nurture your talent, reduce attrition, and boost engagement.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Want custom reporting?</strong> We’ll tailor the analysis to your HR priorities—whether that’s retention, DEI, or workforce planning.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            <strong>Need expert support?</strong> Our team of analysts is here to help you ask better questions—and find better answers.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Let data drive your people decisions—with clarity and confidence.
          </p>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Elevate Your HR Strategy?</h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-6">
            Whether you're leading a growing startup or a global enterprise, our tools give your HR team a competitive edge.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Make Every People Decision Count
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Start using AI to uncover insights that empower your workforce.
          </p>
          <div className="flex justify-center mt-6">
            <Link to="/dashboard" className="inline-block">
              <button className="bg-blue-600 text-white py-3 px-6 rounded-full transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:font-semibold">
                Try HR Insights Now
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
