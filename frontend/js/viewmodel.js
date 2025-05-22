/**
 * ViewModel for the Task Manager application
 * Connects the Model and View, handles business logic
 */
class TaskViewModel {
    constructor(model) {
        this.model = model;
        this.tasks = [];
        this.currentFilter = 'all';
        this.editMode = false;
        this.loading = false;
        this.error = null;
        this.successMessage = null;
        
        // Current task object for adding/editing tasks
        this.resetCurrentTask();
    }

    /**
     * Reset the current task to default values
     */
    resetCurrentTask() {
        this.currentTask = {
            _id: null,
            title: '',
            description: '',
            status: 'pending',
            priority: 'medium',
            dueDate: ''
        };
        this.editMode = false;
    }

    /**
     * Load all tasks from the model
     * @returns {Promise<Array>} - Promise that resolves to the array of tasks
     */
    async loadTasks() {
        this.loading = true;
        try {
            const tasks = await this.model.getAllTasks();
            console.log("Tareas cargadas desde API:", tasks);
            
            if (!Array.isArray(tasks)) {
                console.error("Error: La respuesta de la API no es un array", tasks);
                this.tasks = [];
            } else {
                // Añadir un marcador visual para las tareas recién creadas (útil al recargar)
                // Esto se usa solo para mostrar la etiqueta "Nueva" durante esta sesión
                const tasksWithIsNew = tasks.map(task => {
                    // Si la tarea ya estaba marcada como nueva en el array actual, mantener esa marca
                    const existingTask = this.tasks.find(t => t._id === task._id);
                    return {
                        ...task,
                        isNew: existingTask?.isNew || false
                    };
                });
                
                // Asignar un nuevo array para asegurar la detección de cambios
                this.tasks = [...tasksWithIsNew];
            }
            
            this.error = null;
            console.log("Tareas cargadas y procesadas:", this.tasks.length);
        } catch (error) {
            this.error = 'Error en carregar tasques. Si us plau, torna-ho a provar més tard.';
            console.error("Error al cargar tareas:", error);
        } finally {
            this.loading = false;
        }
        return this.tasks;
    }

    /**
     * Get tasks filtered by status
     * @returns {Array} - Filtered tasks array
     */
    getFilteredTasks() {
        console.log(`Filtrando tareas. Filtro actual: ${this.currentFilter}. Total tareas: ${this.tasks.length}`);
        
        // Asegurarse de que this.tasks es un array
        if (!Array.isArray(this.tasks)) {
            console.error("Error: this.tasks no es un array", this.tasks);
            return [];
        }
        
        // Aplicar filtro
        const filtered = this.currentFilter === 'all' 
            ? [...this.tasks] 
            : this.tasks.filter(task => task.status === this.currentFilter);
        
        console.log(`Tareas filtradas: ${filtered.length}`);
        
        // Log detallado de las tareas
        if (filtered.length > 0) {
            console.log("Primera tarea filtrada:", filtered[0]);
        }
        
        return filtered;
    }

    /**
     * Set the current filter for tasks
     * @param {string} filter - The filter to set ('all', 'pending', 'in-progress', 'completed')
     */
    setFilter(filter) {
        this.currentFilter = filter;
    }

    /**
     * Set a task for editing
     * @param {Object} task - The task to edit
     */
    setTaskForEdit(task) {
        // Clone the task to avoid direct modification
        this.currentTask = { ...task };
        
        // Format date for the input field if it exists
        if (this.currentTask.dueDate) {
            const date = new Date(this.currentTask.dueDate);
            const year = date.getFullYear();
            // Month is 0-indexed, add 1 and ensure 2 digits
            const month = String(date.getMonth() + 1).padStart(2, '0');
            // Ensure 2 digits for the day
            const day = String(date.getDate()).padStart(2, '0');
            this.currentTask.dueDate = `${year}-${month}-${day}`;
        }
        
        this.editMode = true;
    }

    /**
     * Save a task (create or update)
     * @returns {Promise<Object>} - Promise that resolves to the saved task
     */
    async saveTask() {
        try {
            let savedTask;
            
            if (this.editMode && this.currentTask._id) {
                const id = this.currentTask._id;
                const taskData = { ...this.currentTask };
                delete taskData._id; // Remove _id as it shouldn't be part of the update data
                
                savedTask = await this.model.updateTask(id, taskData);
                
                // Update the task in the local array
                const index = this.tasks.findIndex(t => t._id === id);
                if (index !== -1) {
                    this.tasks[index] = savedTask;
                }
                console.log("Task updated:", savedTask);
                this.successMessage = "Tasca actualitzada correctament!";
            } else {
                savedTask = await this.model.createTask(this.currentTask);
                console.log("Task created:", savedTask);
                
                // Marcar la tarea como nueva para aplicar la animación
                savedTask.isNew = true;
                
                // Añadir la tarea al array local en primera posición (ya que está ordenado por más recientes primero)
                this.tasks.unshift(savedTask);
                
                // Si el filtro actual no incluiría esta tarea, cambiar a 'all'
                if (this.currentFilter !== 'all' && this.currentFilter !== savedTask.status) {
                    this.setFilter('all');
                }
                
                console.log("Tareas después de crear:", this.tasks);
                this.successMessage = "Tasca creada correctament!";
            }
            
            // Reset current task and edit mode
            this.resetCurrentTask();
            this.error = null;
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                this.successMessage = null;
            }, 3000);
            
            return savedTask;
        } catch (error) {
            this.error = 'Error al desar la tasca. Si us plau, torna a provar-ho.';
            this.successMessage = null;
            console.error(error);
            throw error;
        }
    }

    /**
     * Delete a task by ID
     * @param {string} id - ID of the task to delete
     * @returns {Promise<Object>} - Promise that resolves to the response data
     */
    async deleteTask(id) {
        try {
            const result = await this.model.deleteTask(id);
            
            // Remove task from the local array
            this.tasks = this.tasks.filter(task => task._id !== id);
            this.error = null;
            return result;
        } catch (error) {
            this.error = 'Error deleting task. Please try again.';
            console.error(error);
            throw error;
        }
    }

    /**
     * Complete a task by ID - changes status to 'completed'
     * @param {string} id - ID of the task to complete
     * @returns {Promise<Object>} - Promise that resolves to the updated task
     */
    async completeTask(id) {
        try {
            // Find the task in the local array
            const task = this.tasks.find(t => t._id === id);
            if (!task) {
                throw new Error(`Task with ID ${id} not found`);
            }

            // Create updated task data with completed status
            const taskData = { 
                ...task,
                status: 'completed' 
            };
            delete taskData._id; // Remove _id as it shouldn't be part of the update data

            // Update the task in the API
            const updatedTask = await this.model.updateTask(id, taskData);
            
            // Update the task in the local array
            const index = this.tasks.findIndex(t => t._id === id);
            if (index !== -1) {
                this.tasks[index] = updatedTask;
            }
            
            this.error = null;
            this.successMessage = "Tasca completada correctament!";
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                this.successMessage = null;
            }, 3000);
            
            return updatedTask;
        } catch (error) {
            this.error = 'Error al completar la tasca. Si us plau, torna a provar-ho.';
            console.error(error);
            throw error;
        }
    }

    /**
     * Get a descriptive label for a task status
     * @param {string} status - The task status code
     * @returns {string} - Human-readable status label
     */
    getStatusLabel(status) {
        const labels = {
            'pending': 'Pendent',
            'in-progress': 'En progrés',
            'completed': 'Completada'
        };
        return labels[status] || status;
    }

    /**
     * Get a descriptive label for a task priority
     * @param {string} priority - The task priority code
     * @returns {string} - Human-readable priority label
     */
    getPriorityLabel(priority) {
        const labels = {
            'low': 'Baixa',
            'medium': 'Mitjana',
            'high': 'Alta'
        };
        return labels[priority] || priority;
    }

    /**
     * Format a date for display
     * @param {string|Date} date - The date to format
     * @returns {string} - Formatted date string
     */
    formatDate(date) {
        if (!date) return '';
        
        const d = new Date(date);
        return d.toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}
