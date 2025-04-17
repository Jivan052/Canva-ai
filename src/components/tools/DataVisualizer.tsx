import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useDataset } from "@/hooks/useDataset";
import { FileWarning } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Simplified chart types
const CHART_TYPES = [
  {id: "bar", name: "Bar Chart"},
  {id: "line", name: "Line Chart"},
  {id: "pie", name: "Pie Chart"}
];

// Color palette
const COLORS = [
  "#2563eb", "#10b981", "#f59e0b", "#ef4444", 
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"
];

export function DataVisualizer() {
  const { currentDataset } = useDataset();
  
  // Basic state
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  
  // Set initial axes when dataset changes
  useEffect(() => {
    if (!currentDataset || !currentDataset.columns.length) return;
    
    try {
      console.log("Dataset loaded with columns:", currentDataset.columns);
      
      // Find a numeric column for Y-axis if possible
      const xCol = currentDataset.columns[0];
      let yCol = currentDataset.columns[1];
      
      // Try to find a numeric column
      for (let i = 0; i < currentDataset.columns.length; i++) {
        const col = currentDataset.columns[i];
        const sample = currentDataset.data[0]?.[i];
        if (!isNaN(Number(sample))) {
          yCol = col;
          break;
        }
      }
      
      setXAxis(xCol);
      setYAxis(yCol);
      
      // Create chart data
      prepareChartData(xCol, yCol);
    } catch (err) {
      console.error("Error initializing chart:", err);
      setError(`Failed to initialize chart: ${err.message}`);
    }
  }, [currentDataset]);
  
  // Update chart when axes change
  useEffect(() => {
    if (xAxis && yAxis) {
      prepareChartData(xAxis, yAxis);
    }
  }, [xAxis, yAxis, chartType]);
  
  // Prepare chart data based on selected axes
  const prepareChartData = (x, y) => {
    if (!currentDataset) return;
    
    try {
      const xIndex = currentDataset.columns.indexOf(x);
      const yIndex = currentDataset.columns.indexOf(y);
      
      if (xIndex === -1 || yIndex === -1) {
        console.warn("Invalid axes selected:", x, y);
        return;
      }
      
      if (chartType === "pie") {
        // Special handling for pie charts
        const aggregatedData = {};
        
        // Group by X axis and sum Y values
        currentDataset.data.slice(0, 100).forEach(row => {
          const key = String(row[xIndex] || "Unknown");
          const value = Number(row[yIndex]) || 0;
          
          aggregatedData[key] = (aggregatedData[key] || 0) + value;
        });
        
        // Convert to pie chart format (limit to top 10)
        const pieData = Object.entries(aggregatedData)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => Number(b.value) - Number(a.value))
          .slice(0, 10);
        
        console.log("Pie chart data:", pieData);
        setChartData(pieData);
      } else {
        // For bar and line charts
        const data = currentDataset.data.slice(0, 100).map(row => {
          return {
            name: String(row[xIndex] || ""),
            value: Number(row[yIndex]) || 0
          };
        });
        
        console.log(`${chartType} chart data:`, data.slice(0, 3));
        setChartData(data);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error preparing chart data:", err);
      setError(`Failed to prepare chart data: ${err.message}`);
      setChartData([]);
    }
  };
  
  // Render the appropriate chart
  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="p-12 text-center text-gray-500">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p>No data available for chart</p>
          )}
        </div>
      );
    }
    
    const height = 400;
    
    try {
      switch (chartType) {
        case "bar":
          return (
            <ResponsiveContainer width="100%" height={height}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name={yAxis} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          );
          
        case "line":
          return (
            <ResponsiveContainer width="100%" height={height}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name={yAxis} stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          );
          
        case "pie":
          return (
            <ResponsiveContainer width="100%" height={height}>
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Tooltip />
                <Legend />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({name}) => name}
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          );
          
        default:
          return <div>Unknown chart type</div>;
      }
    } catch (err) {
      console.error("Error rendering chart:", err);
      return (
        <div className="p-12 text-center text-red-500">
          Error rendering chart: {err.message}
        </div>
      );
    }
  };

  if (!currentDataset) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileWarning className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>No dataset loaded</p>
        <p className="text-sm">Please load a dataset first</p>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Visualization</CardTitle>
        <CardDescription>
          Visualize your data with different chart types
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Chart Type Selection */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Chart Type</h3>
          <div className="flex flex-wrap gap-2">
            {CHART_TYPES.map(type => (
              <Badge 
                key={type.id}
                variant={chartType === type.id ? "default" : "outline"}
                className="text-sm py-1 px-3 cursor-pointer"
                onClick={() => setChartType(type.id)}
              >
                {type.name}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Column Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="text-sm">X-Axis</Label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {currentDataset.columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm">Y-Axis</Label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {currentDataset.columns.map((column) => (
                  <SelectItem key={column} value={column}>
                    {column}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Chart Render */}
        <div className="bg-muted/30 rounded-lg p-4 mb-4 min-h-[400px]">
          {renderChart()}
        </div>
        
        {/* Debug Data Button */}
        <Button 
          variant="outline" 
          onClick={() => console.log("Chart data:", chartData)}
          size="sm"
        >
          Log Chart Data
        </Button>
      </CardContent>
    </Card>
  );
}