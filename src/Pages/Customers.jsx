// src/pages/Customers.jsx
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete, Search } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customerService";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";

export default function Customers() {
  const theme = useTheme();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getAllCustomers();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ✅ Search filter
  useEffect(() => {
    const filtered = customers.filter((c) =>
      Object.values(c).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredCustomers(filtered);
  }, [search, customers]);

  const handleOpen = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: "", email: "", phone: "" });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.customerID, formData);
      } else {
        await createCustomer(formData);
      }
      setOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const columns = [
    { field: "customerID", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
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
            onClick={() => handleDelete(params.row.customerID)}
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
        Customers Management
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.8 }}>
        Manage customer information (Add, Edit, Delete, Export)
      </Typography>

      {/* ✅ Search, Add, Export */}
      <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          + Add Customer
        </Button>

        {/* ✅ Export Buttons */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToCSV(filteredCustomers, "Customers_Report.csv")}
        >
          Download CSV
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => exportToExcel(filteredCustomers, "Customers_Report.xlsx")}
        >
          Download Excel
        </Button>
      </Box>

      {/* ✅ Customers Table */}
      <Box sx={{ height: 420, width: "100%" }}>
        <DataGrid
          rows={filteredCustomers}
          columns={columns}
          getRowId={(row) => row.customerID}
          pageSize={5}
        />
      </Box>

      {/* ✅ Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {editingCustomer ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
