import { ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const features = [
    {
      image: "https://1e5dcb836f18f1acfca4290485cb7c8f.cdn.bubble.io/cdn-cgi/image/w=96,h=139,f=auto,dpr=1.5,fit=contain/f1692896443139x848319302730489200/AGE%20%282%29.png",
      alt: "Data Upload",
      title: "Easy Data Upload",
      description: "Drag and drop your Excel files or connect to Google Sheets in seconds"
    },
    {
      image: "https://cdn-icons-png.flaticon.com/512/10328/10328811.png",
      alt: "AI Analysis",
      title: "AI-Powered Analysis",
      description: "DeepSeek R1 automatically analyzes your data and generates valuable insights"
    },
    {
      image: "https://1e5dcb836f18f1acfca4290485cb7c8f.cdn.bubble.io/cdn-cgi/image/w=96,h=135,f=auto,dpr=1.5,fit=contain/f1692898761029x626197141845966500/AGE%20%2812%29.png",
      alt: "Data Visualization",
      title: "Dynamic Visualizations",
      description: "View your data through interactive charts and customizable dashboards"
    },
    {
      image: "https://1e5dcb836f18f1acfca4290485cb7c8f.cdn.bubble.io/cdn-cgi/image/w=96,h=132,f=auto,dpr=1.5,fit=contain/f1693321717307x561948489983081100/AGE%20%2831%29.png",
      alt: "Smart Insights",
      title: "Smart Insights",
      description: "Get automated recommendations and discover hidden patterns in your data"
    },
    {
      image: "https://1e5dcb836f18f1acfca4290485cb7c8f.cdn.bubble.io/cdn-cgi/image/w=96,h=145,f=auto,dpr=1.5,fit=contain/f1693322449320x188185820792450050/AGE%20%2833%29.png",
      alt: "Export Results",
      title: "Export Results",
      description: "Download reports, charts, and insights in multiple formats for sharing"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 pt-10 px-6 md:px-10 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your data into actionable insights with our simple 5-step process
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line - Only visible on large screens and properly contained */}
          <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 mx-20"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 relative z-10">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                {/* Circular Image Container */}
                <div className="relative mb-6">
                  <div className="w-36 h-36 bg-gradient-to-br from-slate-800 via-gray-900 to-black rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:shadow-3xl group-hover:from-slate-700 group-hover:via-gray-800 group-hover:to-slate-900 overflow-hidden border-4 border-white/20 backdrop-blur-sm relative before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300">
                    <img 
                      src={feature.image} 
                      alt={feature.alt}
                      className="w-24 h-24 object-contain filter brightness-0 invert relative z-10"
                    />
                  </div>
                  {/* Step Number */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}