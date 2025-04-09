
import { FileSpreadsheet, FileUp, AreaChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function UploadSection() {
  const features = [
    {
      icon: <FileUp className="h-8 w-8" />,
      title: "Easy Data Upload",
      description: "Drag and drop your Excel files or connect to Google Sheets in seconds"
    },
    {
      icon: <AreaChart className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "DeepSeek R1 automatically analyzes your data and generates valuable insights"
    },
    {
      icon: <FileSpreadsheet className="h-8 w-8" />,
      title: "Dynamic Visualizations",
      description: "View your data through interactive charts and customizable dashboards"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 md:px-10 bg-secondary">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-sm bg-white">
              <CardContent className="pt-6">
                <div className="mb-4 p-3 rounded-full bg-secondary inline-block">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
