export function jsonToCSV(data: any): string {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return "";
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV rows
  const rows = data.map(item => {
    return headers
      .map(header => {
        const value = item[header];
        // Handle arrays by joining with semicolon
        const cellValue = Array.isArray(value)
          ? value.join("; ")
          : String(value);
        // Escape quotes and wrap in quotes
        return `"${cellValue.replace(/"/g, '""')}"`;
      })
      .join(",");
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows].join("\n");

  return csvContent;
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Clean up the URL object
}
