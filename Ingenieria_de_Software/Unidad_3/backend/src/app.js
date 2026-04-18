const express = require('express');
const cors = require('cors');

const app = express();
const testRoutes = require('./routes/test.routes');


app.use(cors());
app.use(express.json());
app.use('/api', testRoutes);


app.get('/', (req, res) => {
  res.send('API DIGICLIN funcionando');
});

module.exports = app;