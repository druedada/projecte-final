const mongoose = require('mongoose');

// Definir el esquema básico para la tarea
const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, añade un título'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: false,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
