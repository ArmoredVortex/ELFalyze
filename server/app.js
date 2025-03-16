const express = require('express');
const cors = require('cors');
const analysisRoutes = require('./routes/analysis');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', analysisRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
