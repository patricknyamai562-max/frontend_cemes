// src/pages/Payments.jsx
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
  getAllPayments,
  createPayment,
  updatePayment,
  deletePayment,
} from "../api/paymentService";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";

export default function Payments() {
  const theme = useTheme();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");

  const [open, setOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    loanID: "",
    amount: "",
    paymentDate: "",
    branch: "",
  });

  // ✅ Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await getAllPayments();
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Apply filters & search
  useEffect(() => {
    let filtered = payments;

    if (branchFilter !== "All")
      filtered = filtered.filter(
        (p) =>
          p.branch &&
          p.branch.toLowerCase().includes(branchFilter.toLowerCase())
      );

    if (search)
      filtered = filtered.filter((p) =>
        Object.values(p).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );

    setFilteredPayments(filtered);
  }, [search, branchFilter, payments]);

  const handleOpen = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        loanID: payment.loanID,
        amount: payment.amount,
        paymentDate: payment.paymentDate.split("T")[0],
        branch: payment.branch,
      });
    } else {
      setEditingPayment(null);
      setFormData({
        loanID: "",
        amount: "",
        paymentDate: "",
        branch: "",
      });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingPayment) {
        await updatePayment(editingPayment.paymentID, formData);
      } else {
        await createPayment(formData);
      }
      setOpen(false);
      fetchPayments();
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deletePayment(id);
      fetchPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  const columns = [
    { field: "paymentID", headerName: "ID", width: 70 },
    { field: "loanID", headerName: "Loan ID", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "paymentDate", headerName: "Payment Date", flex: 1 },
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
            onClick={() => handleDelete(params.row.paymentID)}
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
      <Box sx={{ display: "flex", justifyContent: "center", height: "70vh" }}>
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Payments Management
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.8 }}>
        Manage payment records (Add, Edit, Delete, Filter, Export)
      </Typography>

      {/* ✅ Filters, Add, Export */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          placeholder="Search payments..."
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

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          + Add Payment
        </Button>

        {/* ✅ Export Buttons */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToCSV(filteredPayments, "Payments_Report.csv")}
        >
          Download CSV
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToExcel(filteredPayments, "Payments_Report.xlsx")}
        >
          Download Excel
        </Button>
      </Box>

      {/* ✅ Data Table */}
      <Box sx={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={filteredPayments}
          columns={columns}
          getRowId={(row) => row.paymentID}
          pageSize={5}
        />
      </Box>

      {/* ✅ Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingPayment ? "Edit Payment" : "Add New Payment"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(formData).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <TextField
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  fullWidth
                  type={key === "paymentDate" ? "date" : "text"}
                  value={value}
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
            {editingPayment ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
