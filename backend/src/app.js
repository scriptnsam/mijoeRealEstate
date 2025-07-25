// backend/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { resSuccess } = require('./utils/response')

const app = express();
const PORT = process.env.PORT || 3001;


const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

app.use(express.static(path.join(__dirname, '../../')));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB Connected')).catch(err => console.error(err))

app.use('/api/auth', authRoutes);
app.use('/api/properties', require('./routes/property'));
app.use('/api/requests', require('./routes/request'));
app.use('/api/manage', require('./routes/managementRequest'));
app.use('/api/users', require('./routes/users'));
app.use('/api/status', (req, res) => {
  resSuccess(res, "All services up.", {
    siteState: "up",
    siteVersion: "1.0.0",
    apiVersion: "1.0.0",
  })
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

