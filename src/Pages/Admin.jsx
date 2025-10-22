import { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Button, TextField, Box
} from "@mui/material";
import {
  getAllAdmins, createAdmin, updateAdmin, deleteAdmin
} from "../api/adminService";

export default function Admin() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAdmin(editingId, form);
      } else {
        await createAdmin(form);
      }
      setForm({ name: "", email: "", role: "" });
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      alert("Failed to save admin");
    }
  };

  const handleEdit = (admin) => {
    setForm({ name: admin.name, email: admin.email, role: admin.role });
    setEditingId(admin.adminID);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await deleteAdmin(id);
      fetchAdmins();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Management</Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, mb: 3 }}
      >
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <TextField
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <TextField
          label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          required
        />
        <Button type="submit" variant="contained" color="success">
          {editingId ? "Update" : "Add"}
        </Button>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((a) => (
                <TableRow key={a.adminID}>
                  <TableCell>{a.adminID}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell>{a.role}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => handleEdit(a)}>Edit</Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(a.adminID)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
