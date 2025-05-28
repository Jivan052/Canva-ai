import React, { useState, useMemo } from "react";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import { chartData } from "./chartData";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Filter,
  Download,
  Maximize2,
  Grid3X3,
  List
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

type ChartDataType = typeof chartData[0];

// Enhanced color palettes
const colorPalettes = {
  primary: ["#3b82f6", "#1d4ed8", "#1e40af", "#1e3a8a"],
  gradient: ["#06b6d4", "#0891b2", "#0e7490", "#155e75"],
  warm: ["#f59e0b", "#d97706", "#b45309", "#92400e"],
  cool: ["#10b981", "#059669", "#047857", "#065f46"],
  purple: ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6"],
  rose: ["#f43f5e", "#e11d48", "#be123c", "#9f1239"],
};

const ChartDisplay = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedChart, setSelectedChart] = useState<number | null>(null);

  // Get unique chart types for filtering
  const chartTypes = useMemo(() => {
    const types = Array.from(new Set(chartData.map(chart => chart.chartType)));
    return ['all', ...types];
  }, []);

  // Filter charts based on selected type
  const filteredCharts = useMemo(() => {
    return filterType === 'all' 
      ? chartData 
      : chartData.filter(chart => chart.chartType === filterType);
  }, [filterType]);

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-5 h-5" />;
      case 'line': case 'area': return <TrendingUp className="w-5 h-5" />;
      case 'pie': case 'doughnut': return <PieChart className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getEnhancedData = (chart: ChartDataType, index: number) => {
    const paletteKeys = Object.keys(colorPalettes);
    const palette = colorPalettes[paletteKeys[index % paletteKeys.length]];
    
    const isMultiDataset = Array.isArray(chart.data[0]);
    
    if (isMultiDataset) {
      return {
        labels: chart.labels,
        datasets: chart.data.map((dataset, i) => ({
          label: `Dataset ${i + 1}`,
          data: dataset,
          backgroundColor: chart.chartType === 'pie' || chart.chartType === 'doughnut' 
            ? palette 
            : palette[i % palette.length] + '80',
          borderColor: palette[i % palette.length],
          borderWidth: 2,
          fill: chart.chartType === 'area',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        }))
      };
    }

    return {
      labels: chart.labels,
      datasets: [{
        label: chart.title || "Dataset",
        data: chart.data,
        backgroundColor: chart.chartType === 'pie' || chart.chartType === 'doughnut' 
          ? palette 
          : palette[0] + '80',
        borderColor: palette[0],
        borderWidth: 2,
        fill: chart.chartType === 'area',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };
  };

  const getEnhancedOptions = (chart: ChartDataType, index: number) => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: { size: 12, weight: '500' },
          }
        },
        title: {
          display: !!chart.title,
          text: chart.title,
          font: { size: 16, weight: 'bold' },
          padding: { bottom: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true,
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart' as const,
      }
    };

    if (chart.chartType === 'line' || chart.chartType === 'area') {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 } }
          }
        }
      };
    }

    if (chart.chartType === 'bar') {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
            ticks: { font: { size: 11 } }
          }
        }
      };
    }

    return baseOptions;
  };

  const renderChart = (chart: ChartDataType, index: number) => {
    const data = getEnhancedData(chart, index);
    const options = getEnhancedOptions(chart, index);

    switch (chart.chartType) {
      case "bar":
        return <Bar data={data} options={options} />;
      case "line":
      case "area":
        return <Line data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      default:
        return <div className="flex items-center justify-center h-48 text-gray-400">Unsupported chart type</div>;
    }
  };

  const downloadChart = (index: number) => {
    // This would implement chart download functionality
    console.log(`Downloading chart ${index}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Visualize your data with interactive charts</p>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {chartTypes.map(type => (
                    <option key={type} value={type} className="capitalize">
                      {type === 'all' ? 'All Charts' : `${type} Charts`}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {chartTypes.slice(1).map(type => {
              const count = chartData.filter(chart => chart.chartType === type).length;
              return (
                <div key={type} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getChartIcon(type)}
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-800">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{type} Charts</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Charts Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 lg:grid-cols-2' 
            : 'grid-cols-1'
        }`}>
          {filteredCharts.map((chart, index) => (
            <div
              key={index}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Chart Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getChartIcon(chart.chartType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {chart.title || `Chart ${index + 1}`}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{chart.chartType} Chart</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadChart(index)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Download Chart"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedChart(selectedChart === index ? null : index)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Expand Chart"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Container */}
              <div className={`p-6 transition-all duration-300 ${
                selectedChart === index ? 'h-96' : 'h-80'
              }`}>
                {renderChart(chart, index)}
              </div>

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/30 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCharts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No charts found</h3>
            <p className="text-gray-500">Try adjusting your filter to see more charts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartDisplay;