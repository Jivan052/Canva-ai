import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function HowItWorks() {
  const features = [
    {
      image: "https://res.cloudinary.com/djbjfsshe/image/upload/v1748474570/file_tnvki2.png",
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
      image: "https://res.cloudinary.com/djbjfsshe/image/upload/v1748474569/visualisation_apf1yk.png",
      title: "Dynamic Visualizations",
      description: "View your data through interactive charts and customizable dashboards"
    },
    {
      image: "https://res.cloudinary.com/djbjfsshe/image/upload/v1748474570/insight_gz28mb.png",
      alt: "Smart Insights",
      title: "Smart Insights",
      description: "Get automated recommendations and discover hidden patterns in your data"
    },
    {
      image: "https://res.cloudinary.com/djbjfsshe/image/upload/v1748474569/results_cy5xdd.png",
      alt: "Export Results",
      title: "Export Results",
      description: "Download reports, charts, and insights in multiple formats for sharing"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-10 bg-background/40 overflow-hidden relative">
      {/* Gradient backgrounds for visual interest */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
              Process
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
              How It Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform your data into actionable insights with our simple 5-step process
          </p>
          <Separator className="max-w-md mx-auto" />
        </div>

        <div className="relative">
          {/* Connecting Line - Only visible on large screens */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-purple-500/30 to-primary/10"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center group"
              >
                {/* Circular Image Container */}
                <div className="relative mb-6">
                  <div className={cn(
                    "w-28 h-28 rounded-full flex items-center justify-center",
                    "shadow-lg transform transition-all duration-500",
                    "group-hover:scale-110 group-hover:shadow-xl",
                    "bg-gradient-to-br from-background to-muted",
                    "border border-border/50 group-hover:border-primary/20",
                    "overflow-hidden backdrop-blur-sm",
                    "before:absolute before:inset-0 before:rounded-full",
                    "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
                    "before:opacity-0 group-hover:before:opacity-100",
                    "before:transition-opacity before:duration-300"
                  )}>
                    <img 
                      src={feature.image} 
                      alt={feature.alt}
                      className="w-16 h-16 object-contain relative z-10"
                    />
                  </div>
                  
                  {/* Step Number */}
                  <div className={cn(
                    "absolute -top-1 -right-1 w-8 h-8 rounded-full",
                    "flex items-center justify-center text-sm font-bold",
                    "bg-gradient-to-br from-primary to-purple-500",
                    "text-primary-foreground shadow-md transition-transform duration-300",
                    "group-hover:scale-110"
                  )}>
                    {index + 1}
                  </div>
                </div>


                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
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