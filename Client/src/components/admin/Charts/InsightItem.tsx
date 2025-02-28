const InsightItem: React.FC<{ title: string; value: string; period: string }> = 
({ title, value, period }) => (
  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
    <div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-gray-400 text-xs">{period}</p>
    </div>
    <span className="font-semibold text-gray-900">₹{value}</span>
  </div>
);

export default InsightItem;