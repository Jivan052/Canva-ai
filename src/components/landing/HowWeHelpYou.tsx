import { Zap, Sparkles, MousePointer, FileText, Users, RefreshCw, Clock, Rocket, Shield } from "lucide-react";

export default function HowWeHelpYou() {
  const helpCards = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Insights",
      description: "Instantly see the story your data is hiding. Just send / upload/ connect your data, and our AI agents will create compelling visuals for you, allowing you to dive into insights right away.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Effortless Data Cleaning",
      description: "Say goodbye to format, typo, input errors and handling multi-currency —DataSquirrel fixes them all automatically, so you can clean your data effortlessly, no formulas required.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <MousePointer className="h-8 w-8" />,
      title: "1-Click Explore & Play",
      description: "Save yourself the headache of manual adjustments—customize with one-click selections like date grouping, segmentation, filtering, heatmap tables, theme changes, and more.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Customizable Reports",
      description: "Create multiple reports tailored to different audiences. Include only the relevant charts, KPIs, or tabular data, and share them as dashboards, presentations, or PDFs.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Seamless Collaboration",
      description: "Share interactive visuals via email or a link. Leave comments & annotations directly on charts to facilitate discussions and decision-making with your team.",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "Automated Workflows",
      description: "No more repetitive work. Updated data is processed just as it was the first time. Schedule updates and reporting daily, weekly, monthly or quarterly or yearly.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Save 80% of your time",
      description: "Experience how quickly DataSquirrel cleans and converts your data into actionable insights. No learning curve. No formulas, pivot tables or coding.",
      gradient: "from-amber-500 to-yellow-500"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Built to be productive!",
      description: "DataSquirrel is designed for on-demand analysis like no other platform. It automates data combining, cleaning, pivoting, and visualizing—providing instant insights and ready-to-share analytics.",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Data Processing",
      description: "Our web-based platform ensures GDPR/PDPA compliance, keeping your data secure and anonymizing sensitive information by default. Plus, your raw data is never sent to LLM.",
      gradient: "from-slate-600 to-gray-700"
    }
  ];

  return (
    <section id="how-we-help-you" className=" py-8 px-6 md:px-10 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How We Help You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover the powerful features that make DataSquirrel your ultimate data analysis companion
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCards.map((card, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Background Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon & Title Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center space-x-4">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-2 flex-shrink-0`}>
                    {card.icon}
                  </div>
                  
                  {/* Title */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-200 leading-tight">
                      {card.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-gray-600 leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-200">
                  {card.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-br group-hover:${card.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}