const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API DIGICLIN funcionando');
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

module.exports = app;

/*const testRoutes = require('./routes/test.routes');
app.use('/api', testRoutes);*/