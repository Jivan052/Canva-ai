import React, { useState } from "react";

interface BlogPost {
  image: string;
  title: string;
  subtitle: string;
  summary: string;
  date: string;
  content?: {
    sections: {
      title: string;
      content: string;
    }[];
  };
}

const blogPosts: BlogPost[] = [
  {
    image: "/public/blog1.jpg",
    title: "DataSquirrel on One Knight in Product Podcast",
    subtitle: "Martijn Moret is featured on the notorious product management podcast",
    summary: "In Episode 234: Most PMs Neglect Data Due To a Lack of Time and Skills, Martijn Moret is interviewed on:",
    date: "Jan 12, 2025",
    content: {
      sections: [
        {
          title: "Most Product Managers Neglect Data",
          content: "Discover why most product managers struggle with data analysis and how this impacts product decisions."
        },
        {
          title: "The Problem with Analysis Paralysis",
          content: "Learn how overthinking data can paralyze decision-making and what to do about it."
        },
        {
          title: "Avoid Confirmation Bias in Data Analysis and Interpretation",
          content: "Understanding how to approach data objectively and avoid common cognitive biases."
        },
        {
          title: "AI Accelerates Data Analysis, but you still need Human Insight",
          content: "Exploring the balance between AI automation and human expertise in data interpretation."
        }
      ]
    }
  },
  {
    image: "/public/blog2.jpg",
    title: "Beyond Rows and Columns: How AI is Transforming Spreadsheet Analysis",
    subtitle: "How AI is Transforming Data Analysis and Why Your Business Should Adopt It",
    summary: "AI is revolutionizing data analysis by providing scalable, accurate, and efficient solutions. Discover how AI data analysis can drive better business decisions, enhance data security, and streamline operations with tailored platforms like DataSquirrel.",
    date: "Aug 19, 2024",
    content: {
      sections: [
        {
          title: "The Spreadsheet Struggle is Real",
          content: "Picture this: It's Monday morning, and you're staring at a spreadsheet with 50,000 rows of sales data. Your boss wants insights by noon, but you're already drowning in columns of numbers that seem to blur together. If you've ever spent hours wrestling with pivot tables, crafting complex formulas, or manually hunting for patterns in your data, you're not alone."
        },
        {
          title: "The Old Way vs. The New Way",
          content: "Manual Analysis takes hours or days with advanced Excel knowledge required, prone to human error, and limited in scope. AI-Powered Analysis provides insights in minutes, requires no technical skills, eliminates human error, and discovers hidden patterns you might miss."
        },
        {
          title: "Automated Data Cleaning: Your Data, Perfected",
          content: "AI excels at tedious but crucial data cleaning tasks: automatically identifies and fixes inconsistencies, intelligently fills data gaps, standardizes formats, and removes duplicates. What used to take hours now happens in seconds."
        },
        {
          title: "Real-World Success Story: Marketing Campaign Analysis",
          content: "Sarah, a marketing manager, used to spend 6.5 hours weekly analyzing campaign data manually. With AI-powered analysis, she now gets comprehensive insights in just 15 minutes, allowing her to focus on strategic improvements. Her campaigns now perform 23% better."
        }
      ]
    }
  },
  {
    image: "/public/blog1.jpg",
    title: "5 Time-Sucking Spreadsheet Tasks You Can Eliminate with AI",
    subtitle: "Reclaim Your Time with Smart Automation",
    summary: "How much of your workday is spent on manual data manipulation? Discover the top 5 time-wasting spreadsheet tasks and how AI automation can give you your time back to focus on what truly matters for your business.",
    date: "Aug 2, 2024",
    content: {
      sections: [
        {
          title: "Manual Data Entry and Consolidation",
          content: "The tedious task of copying and pasting data from multiple sources. AI can automatically pull and merge data from various platforms, eliminating hours of manual work."
        },
        {
          title: "Formatting and Cleaning Data",
          content: "Fixing date formats, removing duplicates, and correcting typos manually is time-consuming and error-prone. AI handles this instantly with perfect accuracy."
        },
        {
          title: "Creating Complex Formulas",
          content: "Building and debugging intricate formulas can be frustrating. AI can perform these calculations based on simple user requests in plain English."
        },
        {
          title: "Generating Visualizations",
          content: "The multi-step process of creating charts and graphs takes valuable time. AI automatically generates the most relevant visualizations for your data."
        },
        {
          title: "Building Reports from Scratch",
          content: "Weekly and monthly reporting shouldn't be repetitive manual work. AI can generate these reports automatically once a template is established, saving hours every week."
        }
      ]
    }
  },
  {
    image: "/public/blog2.jpg",
    title: "Crunching Nonsense: ChatGPT and Data Analysis",
    subtitle: "What 2 years of working with LLMs and Data have taught me.",
    summary: "When I was 14, I read \"Gödel, Escher, Bach\" from Douglas R. Hofstadter. This book fundamentally changed how I think about intelligence, computation, and the nature of understanding itself.",
    date: "Jul 10, 2024",
    content: {
      sections: [
        {
          title: "The Promise vs. Reality of LLMs in Data Analysis",
          content: "Large Language Models promised to revolutionize data analysis, but the reality is more nuanced. Understanding the strengths and limitations is crucial for effective implementation."
        },
        {
          title: "Where ChatGPT Excels in Data Work",
          content: "ChatGPT shines in data interpretation, generating insights from patterns, and explaining complex statistical concepts in plain language. It's particularly effective for exploratory data analysis."
        },
        {
          title: "Critical Limitations to Understand",
          content: "Despite its capabilities, ChatGPT can hallucinate data patterns, struggle with large datasets, and lacks the ability to verify statistical significance. Human oversight remains essential."
        },
        {
          title: "Best Practices for LLM-Assisted Analysis",
          content: "Learn how to effectively combine human expertise with AI capabilities for robust data analysis workflows that leverage the strengths of both."
        }
      ]
    }
  },
];

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const handleBackClick = () => {
    setSelectedPost(null);
  };

  if (selectedPost) {
    return (
      <section className="min-h-screen py-12 px-6 md:px-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors duration-300 group"
          >
            <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>

          {/* Blog post header */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 mb-8">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                  {selectedPost.date}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {selectedPost.title}
              </h1>
              <p className="text-lg font-semibold text-blue-600 mb-6">
                {selectedPost.subtitle}
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                {selectedPost.summary}
              </p>
            </div>
          </div>

          {/* Blog post content sections */}
          {selectedPost.content && (
            <div className="space-y-6">
              {selectedPost.content.sections.map((section, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Call to action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Data Analysis?</h3>
              <p className="text-lg mb-6 opacity-90">
                Discover how DataSquirrel can revolutionize your workflow and unlock insights you never knew existed.
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-24 px-6 md:px-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-violet-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced header */}
        <div className="text-center mb-20">
          <div className="inline-block relative">
            <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4 leading-tight">
              Blog Highlights
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
          </div>
          <p className="text-slate-600 text-lg md:text-xl mt-8 max-w-2xl mx-auto font-medium">
            Discover insights, trends, and innovations in data analysis and AI
          </p>
        </div>

        {/* Blog posts grid */}
        <div className="grid gap-8 md:gap-10 sm:grid-cols-1 lg:grid-cols-2">
          {blogPosts.map((post, index) => (
            <div
              key={index}
              className="group relative bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-500 ease-out cursor-pointer hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] hover:-translate-y-2 shadow-lg border border-white/50"
              onClick={() => handlePostClick(post)}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Image and date layout similar to your image */}
              <div className="flex">
                {/* Left side - Image */}
                <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Right side - Content */}
                <div className="flex-1 p-6 relative z-10">
                  <div className="space-y-3">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-900 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    {/* Subtitle */}
                    <h4 className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-relaxed">
                      {post.subtitle}
                    </h4>
                  </div>

                  {/* Date positioned at top right */}
                  <div className="absolute top-4 right-4 text-xs text-gray-400 font-medium">
                    {post.date}
                  </div>
                </div>
              </div>

              {/* Full width summary section */}
              <div className="px-6 pb-6">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {post.summary}
                  {post.content && post.content.sections.length > 0 && (
                    <>
                      <br /><br />
                      {post.content.sections.map((section, idx) => (
                        <span key={idx}>
                          {idx + 1}. {section.title}
                          {idx < post.content!.sections.length - 1 ? <br /> : ""}
                        </span>
                      ))}
                    </>
                  )}
                </p>

                {/* Read more indicator */}
                <div className="mt-4 flex items-center text-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span>Read full article</span>
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
            <span>View All Posts</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}