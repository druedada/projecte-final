/**
 * Clase Task: Representa el modelo de una tarea en el sistema
 * Implementa la lógica del dominio relacionada con las tareas
 */
export class Task {
  /**
   * Constructor de la clase Task
   * @param {Object} data - Datos iniciales para la tarea
   */
  constructor(data = {}) {
    this._id = data._id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate || null;
    this.isNew = data.isNew || false;
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
  }

  /**
   * Obtiene la etiqueta de estado localizada
   */
  get statusLabel() {
    const labels = {
      'pending': 'Pendent',
      'in-progress': 'En progrés',
      'completed': 'Completada'
    };
    return labels[this.status] || this.status;
  }

  /**
   * Obtiene la etiqueta de prioridad localizada
   */
  get priorityLabel() {
    const labels = {
      'low': 'Baixa',
      'medium': 'Mitjana',
      'high': 'Alta'
    };
    return labels[this.priority] || this.priority;
  }

  /**
   * Obtiene la fecha formateada según la localización
   */
  get formattedDate() {
    if (!this.dueDate) return '';
    
    const date = new Date(this.dueDate);
    return date.toLocaleDateString('ca-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Convierte la instancia a un objeto JSON para enviar a la API
   */
  toJSON() {
    // Excluye propiedades adicionales como isNew al enviar a la API
    const { _id, title, description, status, priority, dueDate } = this;
    const json = { title, description, status, priority };
    
    // Solo incluir _id si existe
    if (_id) json._id = _id;
    
    // Solo incluir dueDate si existe
    if (dueDate) json.dueDate = dueDate;
    
    return json;
  }

  /**
   * Verifica si la tarea está completada
   * @returns {boolean} - true si la tarea está completada
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Marca la tarea como completada
   * @returns {Task} - La instancia modificada
   */
  complete() {
    this.status = 'completed';
    return this;
  }
  
  /**
   * Verifica si la tarea está pendiente
   * @returns {boolean} - true si la tarea está pendiente
   */
  isPending() {
    return this.status === 'pending';
  }
  
  /**
   * Verifica si la tarea está en progreso
   * @returns {boolean} - true si la tarea está en progreso
   */
  isInProgress() {
    return this.status === 'in-progress';
  }
  
  /**
   * Verifica si la tarea tiene prioridad alta
   * @returns {boolean} - true si la tarea tiene prioridad alta
   */
  isHighPriority() {
    return this.priority === 'high';
  }
  
  /**
   * Crea una instancia de Task a partir de datos recibidos de la API
   * @param {Object} data - Datos de la tarea
   * @returns {Task} - Nueva instancia de Task
   */
  static fromApiData(data) {
    return new Task(data);
  }
}
