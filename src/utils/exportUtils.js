// src/utils/exportUtils.js
import { utils, writeFile } from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";

// ✅ Export to CSV
export const exportToCSV = (data, fileName = "report.csv") => {
  if (!data || data.length === 0) return alert("No data to export!");
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};

// ✅ Export to Excel
export const exportToExcel = (data, fileName = "report.xlsx") => {
  if (!data || data.length === 0) return alert("No data to export!");
  const worksheet = utils.json_to_sheet(data);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Report");
  writeFile(workbook, fileName);
};
