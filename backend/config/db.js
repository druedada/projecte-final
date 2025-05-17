const mongoose = require('mongoose');
require('dotenv').config();

// URI para la conexión a MongoDB
const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conexión a MongoDB establecida');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
