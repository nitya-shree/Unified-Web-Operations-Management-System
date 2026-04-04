const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(cors({
  origin: 'https://unified-web-operations-management-s-psi.vercel.app',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ success: false, message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));