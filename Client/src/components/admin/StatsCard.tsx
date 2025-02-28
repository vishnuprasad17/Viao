import React from "react";
import { Calendar, Users, Briefcase, DollarSign } from "react-feather";

interface StatsCardProps {
  title: string;
  value: number;
  icon: "calendar" | "users" | "vendors" | "rupee";
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  // Determine icon based on prop
  const IconComponent = {
    calendar: Calendar,
    users: Users,
    vendors: Briefcase,
    rupee: DollarSign,
  }[icon];

  // Format value based on type
  const formattedValue =
    typeof value === "number"
      ? icon === "rupee"
        ? `₹${value.toLocaleString()}`
        : value.toLocaleString()
      : value;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        {/* Icon and Title */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;