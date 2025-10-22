import React, { useEffect, useState } from "react";
import { Grid, Box, Typography, LinearProgress, Paper } from "@mui/material";
import StatCard from "./StatCard";
import CountUp from "react-countup";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { getAllLoans } from "../api/loanService";
import { getAllCustomers } from "../api/customerService";
import { getAllPayments } from "../api/paymentService";

export default function DashboardStats() {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllLoans(), getAllPayments(), getAllCustomers()])
      .then(([loansData, paymentsData, customersData]) => {
        setLoans(loansData);
        setPayments(paymentsData);
        setCustomers(customersData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LinearProgress />;

  // --- Calculations ---
  const totalDue = loans.reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const unpaidDue = totalDue - totalPaid;
  const paidToday = payments
    .filter(
      (p) =>
        new Date(p.paymentDate).toDateString() === new Date().toDateString()
    )
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const collectionRate = totalDue ? (totalPaid / totalDue) * 100 : 0;

  const currentMonth = new Date().getMonth();
  const newCustomers = customers.filter(
    (c) => new Date(c.createdAt || new Date()).getMonth() === currentMonth
  ).length;
  const disbursedLoans = loans.filter(
    (l) => new Date(l.loanDate).getMonth() === currentMonth
  ).length;

  const totalArrears = unpaidDue;
  const riskPercent = (unpaidDue / totalDue) * 100;

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={3}>
        {/* Collection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Collection
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography>Ksh <CountUp end={totalDue} separator="," /></Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Total Due
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography color="error">Ksh <CountUp end={unpaidDue} separator="," /></Typography>
              <Typography variant="body2">Unpaid</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={collectionRate}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#ffe5e5",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#f44336" },
                }}
              />
              <Typography align="center" sx={{ mt: 1, fontWeight: 500 }}>
                {collectionRate.toFixed(1)}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Productivity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Productivity
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography><CountUp end={newCustomers} /> New Customers</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography><CountUp end={disbursedLoans} /> Disbursed Loans</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography color="primary">{Math.round(collectionRate)}%</Typography>
              <Typography variant="body2">% Funded</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Risk */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Risk
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography>Ksh <CountUp end={totalArrears} separator="," /></Typography>
              <Typography variant="body2">Total Arrears</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
              <Typography color="error">{riskPercent.toFixed(1)}%</Typography>
              <Typography variant="body2">Risk Exposure</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
