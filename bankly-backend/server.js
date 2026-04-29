require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation link: http://localhost:process.env.PORT || 3000/api

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(routes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to Bankly API backend" });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
