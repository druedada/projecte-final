/**
 * Aplicación principal Vue para el Gestor de Tasques
 */
const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            tasks: [],
            currentTask: {
                _id: null,
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                dueDate: ''
            },
            loading: false,
            error: null,
            successMessage: null,
            editMode: false,
            currentFilter: 'all',
            apiBaseUrl: 'http://localhost:3009/api'
        };
    },
    computed: {
        filteredTasks() {
            if (this.currentFilter === 'all') {
                return this.tasks;
            } else {
                return this.tasks.filter(task => task.status === this.currentFilter);
            }
        }
    },
    methods: {
        // Métodos para cargar tareas
        async loadTasks() {
            this.loading = true;
            try {
                const response = await fetch(`${this.apiBaseUrl}/tasks`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const tasks = await response.json();
                
                // Añadir marcador visual para tareas recién creadas
                this.tasks = tasks.map(task => {
                    const existingTask = this.tasks.find(t => t._id === task._id);
                    return {
                        ...task,
                        isNew: existingTask?.isNew || false
                    };
                });
                
                this.error = null;
            } catch (error) {
                console.error('Error fetching tasks:', error);
                this.error = 'Error en carregar tasques. Si us plau, torna-ho a provar més tard.';
            } finally {
                this.loading = false;
            }
        },

        // Métodos para filtrar tareas
        filterTasks(filter) {
            this.currentFilter = filter;
        },

        // Métodos para gestionar tareas
        resetForm() {
            this.currentTask = {
                _id: null,
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                dueDate: ''
            };
            this.editMode = false;
        },

        async saveTask() {
            try {
                let savedTask;
                if (this.editMode && this.currentTask._id) {
                    // Actualizar tarea existente
                    const response = await fetch(`${this.apiBaseUrl}/tasks/${this.currentTask._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.currentTask),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    savedTask = await response.json();
                    
                    // Actualizar la tarea en el array local
                    const index = this.tasks.findIndex(task => task._id === savedTask._id);
                    if (index !== -1) {
                        this.tasks[index] = { ...savedTask };
                    }
                    
                    this.successMessage = 'Tasca actualitzada correctament!';
                } else {
                    // Crear nueva tarea
                    const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.currentTask),
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    savedTask = await response.json();
                    
                    // Añadir la tarea al array local con una marca de "nueva"
                    savedTask.isNew = true;
                    this.tasks.push(savedTask);
                    
                    this.successMessage = 'Tasca creada correctament!';
                }
                
                // Resetear el formulario
                this.resetForm();
                
                // Limpiar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    this.successMessage = null;
                }, 3000);
                
                return savedTask;
            } catch (error) {
                console.error('Error saving task:', error);
                this.error = 'Error en desar la tasca. Si us plau, torna-ho a provar.';
                throw error;
            }
        },

        editTask(task) {
            this.currentTask = { ...task };
            this.editMode = true;
        },

        async deleteTask(id) {
            if (confirm('Estàs segur que vols eliminar aquesta tasca?')) {
                try {
                    const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // Eliminar la tarea del array local
                    this.tasks = this.tasks.filter(task => task._id !== id);
                    this.successMessage = 'Tasca eliminada correctament!';
                    
                    // Limpiar el mensaje de éxito después de 3 segundos
                    setTimeout(() => {
                        this.successMessage = null;
                    }, 3000);
                } catch (error) {
                    console.error(`Error deleting task with ID ${id}:`, error);
                    this.error = 'Error en eliminar la tasca. Si us plau, torna-ho a provar.';
                }
            }
        },
        
        async completeTask(id) {
            try {
                const taskToComplete = this.tasks.find(task => task._id === id);
                if (!taskToComplete) return;
                
                const updatedTask = { ...taskToComplete, status: 'completed' };
                
                const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedTask),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                // Actualizar la tarea en el array local
                const index = this.tasks.findIndex(task => task._id === id);
                if (index !== -1) {
                    this.tasks[index] = { ...result };
                }
                
                this.successMessage = 'Tasca completada correctament!';
                
                // Limpiar el mensaje de éxito después de 3 segundos
                setTimeout(() => {
                    this.successMessage = null;
                }, 3000);
            } catch (error) {
                console.error(`Error completing task with ID ${id}:`, error);
                this.error = 'Error en completar la tasca. Si us plau, torna-ho a provar.';
            }
        },

        // Utilidades
        getPriorityLabel(priority) {
            switch (priority) {
                case 'low': return 'Baixa';
                case 'medium': return 'Mitjana';
                case 'high': return 'Alta';
                default: return 'Mitjana';
            }
        },

        getStatusLabel(status) {
            switch (status) {
                case 'pending': return 'Pendent';
                case 'in-progress': return 'En progrés';
                case 'completed': return 'Completada';
                default: return 'Pendent';
            }
        },

        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('ca-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    },
    created() {
        // Cargar tareas cuando se crea la instancia
        this.loadTasks();
    }
});

// Montar la aplicación cuando se carga el DOM
document.addEventListener('DOMContentLoaded', () => {
    app.mount('#app');
    console.log('Task Manager Application initialized with Vue 3');
});

export default app;
