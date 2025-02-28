import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface AnalyticsChartProps {
  data: number[];
  period: "week" | "month" | "year";
  labels: string[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, period, labels }) => {
  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        tools: {
          zoom: false,
          pan: false,
          download: true
        }
      }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: labels,
      title: { text: period.charAt(0).toUpperCase() + period.slice(1) }
    },
    yaxis: { title: { text: 'Revenue (₹)' } },
    tooltip: {
      x: { show: true },
      y: { formatter: (val) => `₹${val.toLocaleString()}` }
    },
    colors: ['#2979ff']
  };

  const series = [{
    name: 'Revenue',
    data: data
  }];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={350}
    />
  );
};

export default AnalyticsChart;