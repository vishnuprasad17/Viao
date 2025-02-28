import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAnalytics } from "../../../config/services/venderApi";
import VendorRootState from "../../../redux/rootstate/VendorState";
import Layout from "../../../layout/vendor/Layout";
import AnalyticsChart from "../../../components/vendor/Charts/AnalyticsChart";
import StatsCard from "../../../components/vendor/StatsCard";
import InsightItem from "../../../components/vendor/Charts/InsightItem";
import PrintLayout from "../../../components/vendor/PrintLayout";
import { Button, Select, Option } from "@material-tailwind/react";
import { Download, Printer } from "react-feather";
import { exportToCSV } from "../../../utils/exportUtils";
import ReactDOMServer from "react-dom/server";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    reviews: 0,
    bookings: 0,
    rating: 0,
    revenueData: [] as number[],
  });
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const vendor = useSelector((state: VendorRootState) => state.vendor.vendordata);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getAnalytics(vendor?.id, period);

        setStats({
          reviews: response.data.analyticsData.totalReviews,
          bookings: response.data.analyticsData.totalBookings,
          rating: response.data.analyticsData.totalRating,
          revenueData: response.data.analyticsData.revenueArray,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    if (vendor?.id) loadData();
  }, [vendor, period]);

  const handleExport = () => {
    const data = {
      period,
      stats,
      labels: getChartLabels(period),
    };
    exportToCSV(data, `${vendor?.name}_revenue_${period}_report`);
  };

  const getChartLabels = (periodType: string) => {
    switch (periodType) {
      case "week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "month":
        return [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
      case "year":
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, i) => 
          (currentYear - 4 + i).toString()
        );
      default:
        return [];
    }
  };

  const getDaysInPeriod = (periodType: "week" | "month" | "year") => {
    const today = new Date();
    switch (periodType) {
      case "week":
        return 7;
      case "month":
        return new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        ).getDate(); // Days in current month
      case "year":
        const year = today.getFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
      default:
        return 1;
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      // Render the PrintLayout component to HTML
      const printContent = ReactDOMServer.renderToString(
        <PrintLayout
          vendor={vendor!}
          period={period}
          stats={stats}
          getChartLabels={getChartLabels}
        />
      );

      // Write the HTML to the print window
      printWindow.document.write(`
        <html>
          <head>
            <title>${vendor?.name} Revenue Report</title>
            <style>
              /* Add any additional styles here */
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {vendor?.name} Analytics Dashboard
            </h1>
            <p className="text-gray-600">Performance overview and key metrics</p>
          </div>
          <div className="flex gap-2">
            <Button className="flex items-center gap-2" onClick={handleExport}
              color="green"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}>
              <Download size={18} />
              Export Data
            </Button>
            <Button className="flex items-center gap-2"
              color="blue"
              onClick={handlePrint}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}>
              <Printer size={18} />
              Print
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Bookings" 
            value={stats.bookings}
            icon="calendar"
          />
          <StatsCard
            title="Average Rating"
            value={stats.rating}
            icon="star"
          />
          <StatsCard
            title="Total Reviews"
            value={stats.reviews}
            icon="comment"
          />
          <StatsCard
            title="Total Revenue"
            value={stats.revenueData.reduce((a, b) => a + b, 0)}
            icon="rupee"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Revenue Analysis</h2>
            <Select
              label="Select Period"
              value={period}
              onChange={(value) => setPeriod(value as any)}
              className="w-full"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Option value="week">Weekly</Option>
              <Option value="month">Monthly</Option>
              <Option value="year">Yearly</Option>
            </Select>
          </div>
          <AnalyticsChart 
            data={stats.revenueData}
            period={period}
            labels={getChartLabels(period)}
          />
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
            <div className="space-y-3">
              {stats.revenueData.map((value, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {getChartLabels(period)[index]}
                  </span>
                  <span className="font-semibold">
                    ₹{value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="space-y-4">
              <InsightItem
                title="Best Performing Period"
                value={Math.max(...stats.revenueData).toLocaleString()}
                period={getChartLabels(period)[stats.revenueData.indexOf(Math.max(...stats.revenueData))]}
              />
              <InsightItem
                title="Average Daily Revenue"
                value={(stats.revenueData.reduce((a, b) => a + b, 0) / stats.revenueData.length / getDaysInPeriod(period)).toFixed(2)}
                period="Current Period"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;