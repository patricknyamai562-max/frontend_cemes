// src/pages/Loans.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  CircularProgress,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  getAllLoans,
  createLoan,
  updateLoan,
  deleteLoan,
} from "../api/loanService";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";

export default function Loans() {
  const theme = useTheme();
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [open, setOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [formData, setFormData] = useState({
    customerID: "",
    amount: "",
    interestRate: "",
    durationMonths: "",
    status: "",
    branch: "",
  });

  // ✅ Fetch all loans
  const fetchLoans = async () => {
    try {
      setLoading(true);
      const data = await getAllLoans();
      setLoans(data);
      setFilteredLoans(data);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // ✅ Apply filters & search
  useEffect(() => {
    let filtered = loans;

    if (branchFilter !== "All")
      filtered = filtered.filter(
        (loan) =>
          loan.branch &&
          loan.branch.toLowerCase().includes(branchFilter.toLowerCase())
      );

    if (statusFilter !== "All")
      filtered = filtered.filter(
        (loan) =>
          loan.status &&
          loan.status.toLowerCase().includes(statusFilter.toLowerCase())
      );

    if (search)
      filtered = filtered.filter((loan) =>
        Object.values(loan).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );

    setFilteredLoans(filtered);
  }, [search, branchFilter, statusFilter, loans]);

  // ✅ Open modal
  const handleOpen = (loan = null) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({
        customerID: loan.customerID,
        amount: loan.amount,
        interestRate: loan.interestRate,
        durationMonths: loan.durationMonths,
        status: loan.status,
        branch: loan.branch,
      });
    } else {
      setEditingLoan(null);
      setFormData({
        customerID: "",
        amount: "",
        interestRate: "",
        durationMonths: "",
        status: "",
        branch: "",
      });
    }
    setOpen(true);
  };

  // ✅ Save
  const handleSave = async () => {
    try {
      if (editingLoan) {
        await updateLoan(editingLoan.loanID, formData);
      } else {
        await createLoan(formData);
      }
      setOpen(false);
      fetchLoans();
    } catch (error) {
      console.error("Error saving loan:", error);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this loan?")) return;
    try {
      await deleteLoan(id);
      fetchLoans();
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  // ✅ DataGrid Columns
  const columns = [
    { field: "loanID", headerName: "ID", width: 70 },
    { field: "customerID", headerName: "Customer ID", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "interestRate", headerName: "Interest (%)", flex: 1 },
    { field: "durationMonths", headerName: "Months", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "branch", headerName: "Branch", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleOpen(params.row)}
            sx={{ color: theme.palette.primary.main }}
          >
            <Edit fontSize="small" />
          </Button>
          <Button
            size="small"
            onClick={() => handleDelete(params.row.loanID)}
            sx={{ color: theme.palette.error.main }}
          >
            <Delete fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  if (loading)
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Loans Management
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.8 }}>
        Manage loan records (Add, Edit, Delete, Filter, Export)
      </Typography>

      {/* ✅ Filters, Add, Export */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          placeholder="Search loans..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 250 }}
        />

        <TextField
          select
          label="Filter by Branch"
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="All">All Branches</MenuItem>
          <MenuItem value="Ruai">Ruai</MenuItem>
          <MenuItem value="Donholm">Donholm</MenuItem>
          <MenuItem value="Pipeline">Pipeline</MenuItem>
        </TextField>

        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="All">All Status</MenuItem>
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Defaulted">Defaulted</MenuItem>
        </TextField>

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          + Add Loan
        </Button>

        {/* ✅ Export Buttons */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToCSV(filteredLoans, "Loans_Report.csv")}
        >
          Download CSV
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToExcel(filteredLoans, "Loans_Report.xlsx")}
        >
          Download Excel
        </Button>
      </Box>

      {/* ✅ Data Table */}
      <Box sx={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={filteredLoans}
          columns={columns}
          getRowId={(row) => row.loanID}
          pageSize={5}
        />
      </Box>

      {/* ✅ Add/Edit Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingLoan ? "Edit Loan" : "Add New Loan"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.keys(formData).map((key) => (
              <Grid item xs={6} key={key}>
                <TextField
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  fullWidth
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingLoan ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
