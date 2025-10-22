// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Container,
  Divider,
  useTheme,
} from "@mui/material";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE = "https://localhost:7200/api"; // change if hosted

function StatCard({ title, value, prefix = "", suffix = "", color }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        textAlign: "center",
        background: color || "linear-gradient(135deg, #1976d2, #2196f3)",
        color: "white",
      }}
    >
      <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
        <CountUp end={value} duration={2} separator="," prefix={prefix} suffix={suffix} />
      </Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanRes, payRes, custRes] = await Promise.all([
          axios.get(`${API_BASE}/Loan`),
          axios.get(`${API_BASE}/Payment`),
          axios.get(`${API_BASE}/Customer`),
        ]);
        setLoans(loanRes.data);
        setPayments(payRes.data);
        setCustomers(custRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Dashboard metrics
  const totalLoans = loans.reduce((sum, l) => sum + (l.amount || 0), 0);
  const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const outstanding = totalLoans - totalPayments;
  const totalCustomers = customers.length;

  const productivity = ((totalPayments / totalLoans) * 100).toFixed(1);
  const risk = ((outstanding / totalLoans) * 100).toFixed(1);

  // ✅ Monthly data for charts
  const monthlyLoans = {};
  loans.forEach((l) => {
    const month = new Date(l.loanDate).toLocaleString("default", { month: "short" });
    monthlyLoans[month] = (monthlyLoans[month] || 0) + (l.amount || 0);
  });

  const monthlyPayments = {};
  payments.forEach((p) => {
    const month = new Date(p.paymentDate).toLocaleString("default", { month: "short" });
    monthlyPayments[month] = (monthlyPayments[month] || 0) + (p.amount || 0);
  });

  const months = [...new Set([...Object.keys(monthlyLoans), ...Object.keys(monthlyPayments)])];
  const chartData = months.map((m) => ({
    month: m,
    Loans: monthlyLoans[m] || 0,
    Payments: monthlyPayments[m] || 0,
  }));

  // ✅ Gender Distribution Data
  const genderCounts = customers.reduce(
    (acc, c) => {
      if (c.gender?.toLowerCase() === "male") acc.male++;
      else if (c.gender?.toLowerCase() === "female") acc.female++;
      else acc.unknown++;
      return acc;
    },
    { male: 0, female: 0, unknown: 0 }
  );

  const genderData = [
    { name: "Male", value: genderCounts.male },
    { name: "Female", value: genderCounts.female },
    { name: "Unknown", value: genderCounts.unknown },
  ];

  const COLORS = ["#1976d2", "#f06292", "#9e9e9e"];

  // ✅ Quick insights
  const getInsights = () => {
    const insights = [];
    if (totalPayments > totalLoans * 0.8)
      insights.push("💰 Excellent repayment performance this period.");
    else if (totalPayments > 0)
      insights.push("📈 Steady collections — continue follow-ups.");
    else insights.push("⚠️ No recent payments — check overdue clients.");

    if (risk < 20) insights.push("✅ Low portfolio risk. Healthy balance sheet.");
    else insights.push("🔔 Risk level rising — monitor delinquent loans.");

    insights.push(`👥 Active Customers: ${totalCustomers}`);
    return insights;
  };

  const insights = getInsights();

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h6">Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      {/* HEADER */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        📊 CEMES Branch Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Real-time summary of loans, repayments, and customer activity.
      </Typography>

      {/* STAT CARDS */}
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Loans" value={totalLoans} prefix="KSh " />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Payments" value={totalPayments} prefix="KSh " />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Outstanding"
            value={outstanding}
            prefix="KSh "
            color="linear-gradient(135deg, #ff9800, #ffb74d)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Customers" value={totalCustomers} />
        </Grid>
      </Grid>

      {/* PRODUCTIVITY + RISK */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Productivity Rate"
            value={parseFloat(productivity)}
            suffix="%"
            color="linear-gradient(135deg, #4caf50, #81c784)"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Risk Ratio"
            value={parseFloat(risk)}
            suffix="%"
            color="linear-gradient(135deg, #f44336, #ef9a9a)"
          />
        </Grid>
      </Grid>

      {/* --- CHARTS SECTION --- */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📈 Monthly Trends
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Loan Disbursement (KSh)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Loans" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payments Received (KSh)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Payments" stroke="#4caf50" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* --- GENDER DISTRIBUTION PIE CHART --- */}
      <Box mt={6}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🧍‍♂️🧍‍♀️ Customer Gender Distribution
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Paper sx={{ p: 3, borderRadius: 3, height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {genderData.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* --- QUICK INSIGHTS --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Container sx={{ mt: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: theme.palette.background.paper,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🌟 Quick Insights
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {insights.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Typography variant="body1">{text}</Typography>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Container>
  );
}
