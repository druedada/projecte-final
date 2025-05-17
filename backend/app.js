const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

// Conectar a la base de datos
connectDB();

// Inicializar la aplicación Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',  // Permitir cualquier origen para desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rutas
app.use('/api', apiRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API del Gestor de Tareas' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});

module.exports = app;
