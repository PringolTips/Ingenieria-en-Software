const express = require('express');
const cors = require('cors');

const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middlewares/error.middleware');
const healthRoutes = require('./routes/health.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API DIGICLIN funcionando');
});



app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);

app.use(cors({
  origin: ['https://d3iroc0yc8yji7.cloudfront.net',
           'https://digiclin.online',
           'https://www.digiclin.online'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

module.exports = app;

/*const testRoutes = require('./routes/test.routes');
app.use('/api', testRoutes);*/