import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, Sparkles, Users, Shield, Zap } from "lucide-react";

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What types of data does DataSquirrel support?",
      answer: "DataSquirrel supports a wide variety of data formats including Excel files (.xlsx, .xls), CSV files, Google Sheets, and direct database connections. We can handle structured data from sales reports, financial statements, customer databases, inventory systems, and more.",
    },
    {
      question: "Can I connect my data and set automatic updates on it?",
      answer: "Yes! DataSquirrel offers seamless integration with popular data sources like Google Sheets, databases, and cloud storage. You can set up automatic data refreshes to ensure your insights are always up-to-date without manual intervention.",
    },
    {
      question: "Can I analyze spreadsheets with multiple tabs?",
      answer: "Absolutely! DataSquirrel can process and analyze complex Excel workbooks with multiple sheets and tabs. Our AI automatically detects relationships between different sheets and provides comprehensive analysis across all your data.",
     
    },
    {
      question: "What is the onboarding process?",
      answer: "Getting started is simple: 1) Sign up for your account, 2) Upload your data or connect your data sources, 3) Let our AI analyze and clean your data, 4) Review automated insights and visualizations, 5) Customize dashboards to your needs. The entire process takes just minutes!",
     
    },
    {
      question: "Can my non-tech business teams use DataSquirrel without prior training, unlike Tableau or Power BI?",
      answer: "Yes! DataSquirrel is designed specifically for non-technical users. Unlike complex tools like Tableau or Power BI that require extensive training, DataSquirrel's AI handles the technical complexity automatically, providing insights in plain English that anyone can understand and act upon.",
     
    },
    {
      question: "Why do you emphasize so much on Cleaning Datasets prior to analysis?",
      answer: "Clean data is the foundation of accurate insights. Dirty data with duplicates, inconsistencies, and errors leads to misleading conclusions and poor business decisions. Our AI automatically identifies and fixes data quality issues, ensuring your analysis is based on reliable, accurate information.",
     
    },
    {
      question: "Why do I need auto-analysis and auto-insights?",
      answer: "Manual analysis is time-consuming and prone to human bias. Auto-analysis ensures you don't miss important patterns, trends, or anomalies in your data. Our AI can process thousands of data points instantly, uncovering insights that might take analysts hours or days to discover manually.",
     
    },
    {
      question: "Is DataSquirrel free?",
      answer: "DataSquirrel offers both free and premium plans. Our free tier includes basic analysis features for small datasets. Premium plans provide advanced AI insights, larger data processing capabilities, automated reporting, and priority support. Check our pricing page for detailed information.",
     
    },
    {
      question: "Do you provide Analytics as a Service as well?",
      answer: "Yes! Beyond our self-service platform, we offer Analytics as a Service for enterprises that need custom analysis, dedicated support, or specialized industry insights. Our team of data experts can work directly with your data to provide tailored analytical solutions.",
     
    },
    {
      question: "What is DataSquirrel's AI angle in data analytics?",
      answer: "DataSquirrel leverages advanced AI, including DeepSeek R1, to automate the entire analytics pipeline - from data cleaning and pattern recognition to insight generation and visualization creation. Our AI acts as your personal data analyst, working 24/7 to uncover actionable business intelligence.",
    
    },
    {
      question: "What is the difference between DataSquirrel and an LLM like ChatGPT?",
      answer: "While ChatGPT is a general-purpose language model, DataSquirrel is specifically built for data analysis. We combine specialized data processing algorithms with AI to provide accurate statistical analysis, data visualization, and business insights - something general LLMs cannot reliably do with your actual business data.",
    
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Data Sources": "bg-blue-50 text-blue-700 border-blue-200",
      "Integration": "bg-green-50 text-green-700 border-green-200",
      "Features": "bg-purple-50 text-purple-700 border-purple-200",
      "Getting Started": "bg-orange-50 text-orange-700 border-orange-200",
      "Usability": "bg-teal-50 text-teal-700 border-teal-200",
      "Data Quality": "bg-yellow-50 text-yellow-700 border-yellow-200",
      "AI Insights": "bg-indigo-50 text-indigo-700 border-indigo-200",
      "Pricing": "bg-pink-50 text-pink-700 border-pink-200",
      "Enterprise": "bg-gray-50 text-gray-700 border-gray-200",
      "AI Technology": "bg-red-50 text-red-700 border-red-200",
      "Comparison": "bg-cyan-50 text-cyan-700 border-cyan-200"
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <section id="faqs" className="pb-12 px-6 md:px-10 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about DataSquirrel. Can't find the answer you're looking for? 
            <span className="text-blue-600 font-semibold"> Reach out to our team.</span>
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 ">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`group bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-black/5overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-blue-100/50 hover:scale-[1.02] ${
                openIndex === index ? 'ring-2 ring-blue-200 shadow-lg shadow-blue-100/50' : ''
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-3 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-1">
                    <h5 className="text-xs md:text-lg font-semibold text-gray-900 group-hover:text-blue-800 transition-colors duration-300 leading-tight">
                      {faq.question}
                    </h5>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className={`p-2 rounded-full transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-blue-100 rotate-180' 
                      : 'bg-gray-100 group-hover:bg-blue-50'
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-colors duration-300 ${
                      openIndex === index ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                  </div>
                </div>
              </button>
              
              <div className={`transition-all duration-500 ease-out ${
                openIndex === index 
                  ? 'max-h-96 opacity-100' 
                  : 'max-h-0 opacity-0'
              } overflow-hidden`}>
                <div className="px-8 pb-8">
                  <div className="h-px bg-gradient-to-r from-blue-200 via-purple-200 to-transparent mb-6"></div>
                  <div className="relative">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
                    <p className="text-gray-700 leading-relaxed text-sm pl-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}