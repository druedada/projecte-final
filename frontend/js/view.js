/**
 * View for the Task Manager application
 * Handles UI rendering and user interaction using Vue.js
 */
class TaskView {
    constructor(viewModel) {
        this.viewModel = viewModel;
        this.app = null;
    }

    /**
     * Initialize the Vue application
     */
    initializeApp() {
        const self = this;
        
        this.app = Vue.createApp({
            data() {
                return {
                    tasks: self.viewModel.tasks,
                    currentTask: self.viewModel.currentTask,
                    loading: self.viewModel.loading,
                    error: self.viewModel.error,
                    successMessage: self.viewModel.successMessage,
                    editMode: self.viewModel.editMode,
                    currentFilter: self.viewModel.currentFilter
                };
            },
            computed: {
                filteredTasks() {
                    // Asegurarse de que las tareas están siempre actualizadas desde el viewModel
                    const filtered = self.viewModel.getFilteredTasks();
                    console.log(`Computando filteredTasks. Filtro actual: ${this.currentFilter}, Tareas disponibles: ${this.tasks.length}, Tareas filtradas: ${filtered.length}`);
                    
                    // Esto causa que Vue reevalúe la propiedad cuando cambie this.tasks o this.currentFilter
                    if (this.tasks.length > 0) {
                        return filtered.map(task => ({...task})); // Retornar una nueva referencia para cada tarea
                    }
                    return filtered;
                }
            },
            methods: {
                // Task operations
                async loadTasks() {
                    try {
                        this.loading = true;
                        await self.viewModel.loadTasks();
                        this.tasks = self.viewModel.tasks;
                        console.log("Tareas recargadas:", this.tasks);
                    } catch (error) {
                        this.error = self.viewModel.error;
                    } finally {
                        this.loading = false;
                    }
                },
                
                async saveTask() {
                    try {
                        const savedTask = await self.viewModel.saveTask();
                        console.log("Tarea guardada:", savedTask);
                        
                        // Actualizar los datos locales
                        this.currentTask = { ...self.viewModel.currentTask };
                        this.editMode = self.viewModel.editMode;
                        this.successMessage = self.viewModel.successMessage;
                        
                        // Asegurar que el filtro está actualizado
                        this.currentFilter = self.viewModel.currentFilter;
                        
                        // Crear una nueva referencia para el array de tareas (esto es clave para la reactividad)
                        this.tasks = [...self.viewModel.tasks];
                        
                        console.log("Vista actualizada con tareas:", this.tasks.length);
                        console.log("Tareas en vista:", this.tasks);
                        
                        // Forzar refresco completo y volver a computar propiedades
                        this.$forceUpdate();
                        
                        // Doble verificación después del siguiente ciclo de renderizado
                        this.$nextTick(() => {
                            // Volver a actualizar la referencia por si acaso
                            this.tasks = [...self.viewModel.tasks];
                            console.log("Tareas filtradas después de nextTick:", this.filteredTasks.length);
                        });
                        
                        // Clear success message after 3 seconds
                        setTimeout(() => {
                            this.successMessage = null;
                        }, 3000);
                    } catch (error) {
                        this.error = self.viewModel.error;
                        console.error("Error al guardar tarea:", error);
                    }
                },
                editTask(task) {
                    self.viewModel.setTaskForEdit(task);
                    this.currentTask = self.viewModel.currentTask;
                    this.editMode = self.viewModel.editMode;
                },
                async deleteTask(id) {
                    if (confirm('Estàs segur que vols eliminar aquesta tasca?')) {
                        try {
                            await self.viewModel.deleteTask(id);
                            this.tasks = self.viewModel.tasks;
                        } catch (error) {
                            this.error = self.viewModel.error;
                        }
                    }
                },
                resetForm() {
                    self.viewModel.resetCurrentTask();
                    this.currentTask = self.viewModel.currentTask;
                    this.editMode = self.viewModel.editMode;
                },
                
                async completeTask(id) {
                    try {
                        const updatedTask = await self.viewModel.completeTask(id);
                        console.log("Tarea completada:", updatedTask);
                        
                        // Actualizar la lista de tareas con una nueva referencia
                        this.tasks = [...self.viewModel.tasks];
                        this.successMessage = self.viewModel.successMessage;
                        
                        // Forzar actualización
                        this.$forceUpdate();
                        
                        this.$nextTick(() => {
                            console.log("Vista actualizada después de completar tarea");
                        });
                    } catch (error) {
                        this.error = self.viewModel.error;
                        console.error("Error al completar tarea:", error);
                    }
                },
                
                // Filtering
                filterTasks(filter) {
                    console.log(`Cambiando filtro de "${this.currentFilter}" a "${filter}"`);
                    
                    self.viewModel.setFilter(filter);
                    this.currentFilter = self.viewModel.currentFilter;
                    
                    // Forzar actualización inmediata
                    this.$forceUpdate();
                    
                    // Verificar después del renderizado
                    this.$nextTick(() => {
                        console.log(`Filtro cambiado a "${filter}". Total: ${this.tasks.length}, Filtradas: ${this.filteredTasks.length}`);
                        console.log("Detalle de tareas filtradas:", this.filteredTasks);
                    });
                },
                
                // Formatting and labels
                formatDate(date) {
                    return self.viewModel.formatDate(date);
                },
                getStatusLabel(status) {
                    return self.viewModel.getStatusLabel(status);
                },
                getPriorityLabel(priority) {
                    return self.viewModel.getPriorityLabel(priority);
                }
            },
            async mounted() {
                try {
                    this.loading = true;
                    console.log("Iniciando carga de tareas en mounted...");
                    
                    // Asegurarse de que el filtro está en 'all' para mostrar todas las tareas
                    self.viewModel.setFilter('all');
                    this.currentFilter = 'all';
                    
                    // Cargar tareas desde el servidor
                    await self.viewModel.loadTasks();
                    
                    // Actualizar la referencia del array de tareas
                    this.tasks = [...self.viewModel.tasks];
                    
                    console.log("Componente montado con tareas:", this.tasks.length);
                    console.log("Detalles de las tareas:", this.tasks);
                    
                    // Forzar la actualización de la vista y recalcular props computadas
                    this.$forceUpdate();
                    
                    // Verificación adicional después del renderizado
                    this.$nextTick(() => {
                        console.log("Tareas filtradas después de montaje:", this.filteredTasks.length);
                        console.log("Datos de las tareas filtradas:", this.filteredTasks);
                    });
                    
                    // Configurar un refresco periódico (cada 30 segundos)
                    setInterval(async () => {
                        try {
                            console.log("Realizando actualización automática...");
                            await self.viewModel.loadTasks();
                            this.tasks = [...self.viewModel.tasks];
                            this.$forceUpdate();
                            console.log("Tareas actualizadas automáticamente:", this.tasks.length);
                        } catch (err) {
                            console.error("Error en actualización automática:", err);
                        }
                    }, 30000);
                } catch (error) {
                    this.error = self.viewModel.error;
                    console.error("Error al cargar las tareas inicialmente:", error);
                } finally {
                    this.loading = false;
                }
            }
        });
        
        return this.app;
    }
    
    /**
     * Mount the Vue application to a DOM element
     * @param {string} selector - CSS selector for the mount element
     */
    mount(selector) {
        if (!this.app) {
            this.initializeApp();
        }
        this.app.mount(selector);
    }
}
