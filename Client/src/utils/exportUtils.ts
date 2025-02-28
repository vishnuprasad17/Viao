export const exportToCSV = (data: any, filename: string) => {
  const statEntries = Object.entries(data.stats).filter(([key]) => key !== 'revenueData');
  const statHeaders = statEntries.map(([key]) => key);
  const statValues = statEntries.map(([, value]) => value);

  const revenueHeaders = data.labels;
  const revenueValues = data.stats.revenueData;

  const headers = ['period', ...statHeaders, ...revenueHeaders];
  const row = [data.period, ...statValues, ...revenueValues];

  const csvContent = [
    headers.join(','),
    row.join(',')
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};