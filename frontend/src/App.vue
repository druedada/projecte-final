<template>
  <header>
    <h1>Gestor de Tasques</h1>
  </header>

  <main>
    <div class="container">
      <div class="task-form">
        <h2>{{ editMode ? 'Editar Tasca' : 'Nova Tasca' }}</h2>
        <form @submit.prevent="saveTask">
          <div class="form-group">
            <label for="title">Títol</label>
            <input type="text" id="title" v-model="currentTask.title" required>
          </div>
          <div class="form-group">
            <label for="description">Descripció</label>
            <textarea id="description" v-model="currentTask.description"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="status">Estat</label>
              <select id="status" v-model="currentTask.status">
                <option value="pending">Pendent</option>
                <option value="in-progress">En progrés</option>
                <option value="completed">Completada</option>
              </select>
            </div>
            <div class="form-group">
              <label for="priority">Prioritat</label>
              <select id="priority" v-model="currentTask.priority">
                <option value="low">Baixa</option>
                <option value="medium">Mitjana</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="dueDate">Data límit</label>
            <input type="date" id="dueDate" v-model="currentTask.dueDate">
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn primary">{{ editMode ? 'Actualitzar' : 'Crear' }}</button>
            <button type="button" class="btn secondary" @click="resetForm">Cancel·lar</button>
          </div>
        </form>
      </div>

      <div class="task-list">
        <h2>Llista de Tasques</h2>
        <div class="filters">
          <button @click="filterTasks('all')" :class="{ active: currentFilter === 'all' }">Totes</button>
          <button @click="filterTasks('pending')" :class="{ active: currentFilter === 'pending' }">Pendents</button>
          <button @click="filterTasks('in-progress')" :class="{ active: currentFilter === 'in-progress' }">En progrés</button>
          <button @click="filterTasks('completed')" :class="{ active: currentFilter === 'completed' }">Completades</button>
          <button @click="loadTasks" class="refresh-btn" title="Refrescar tasques"><i class="fas fa-sync"></i></button>
        </div>
        <div class="task-summary">
          <span>Total: <strong>{{ tasks.length }}</strong></span>
          <span>Filtrades: <strong>{{ filteredTasks.length }}</strong></span>
          <span>Filtre actual: <strong>{{ currentFilter === 'all' ? 'Totes' : 
                                      currentFilter === 'pending' ? 'Pendents' :
                                      currentFilter === 'in-progress' ? 'En progrés' : 'Completades' }}</strong></span>
        </div>
        
        <div v-if="successMessage" class="success-message">
          <i class="fas fa-check-circle"></i> {{ successMessage }}
        </div>
        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i> {{ error }}
        </div>
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i> Carregant tasques...
        </div>
        <div v-else-if="filteredTasks.length === 0" class="no-tasks">
          No hi ha tasques {{ currentFilter !== 'all' ? 'amb aquest filtre' : '' }}.
          <div v-if="currentFilter !== 'all' && tasks.length > 0" class="filter-suggestion">
            Hi ha {{ tasks.length }} tasques en total. <a href="#" @click.prevent="filterTasks('all')">Mostrar totes</a>
          </div>
        </div>
        <ul v-else class="tasks">
          <TaskCard 
            v-for="task in filteredTasks" 
            :key="task._id" 
            :task="task"
            @edit="editTask"
            @complete="completeTask"
            @delete="deleteTask"
          />
        </ul>
      </div>
    </div>
  </main>

  <footer>
    <p>&copy; 2025 Gestor de Tasques - Projecte DAW 1-RA9 - Fran Gutiez i Daniel Rueda</p>
  </footer>
</template>

<script>
import { TaskModel } from './services/TaskModel';
import { Task } from './models/Task';
import TaskCard from './components/TaskCard.vue';

export default {
  name: 'App',
  components: {
    TaskCard
  },
  data() {
    return {
      tasks: [],
      currentTask: new Task(),
      loading: false,
      error: null,
      successMessage: null,
      editMode: false,
      currentFilter: 'all',
      taskModel: new TaskModel()
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
    async loadTasks() {
      this.loading = true;
      try {
        const tasks = await this.taskModel.getAllTasks();
        
        // Añadir marcador visual para tareas recién creadas
        this.tasks = tasks.map(task => {
          const existingTask = this.tasks.find(t => t._id === task._id);
          if (existingTask?.isNew) {
            task.isNew = true;
          }
          return task;
        });
        
        this.error = null;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.error = 'Error en carregar tasques. Si us plau, torna-ho a provar més tard.';
      } finally {
        this.loading = false;
      }
    },

    filterTasks(filter) {
      this.currentFilter = filter;
    },

    resetForm() {
      this.currentTask = new Task();
      this.editMode = false;
    },

    async saveTask() {
      try {
        let savedTask;
        
        if (this.editMode && this.currentTask._id) {
          // Actualizar tarea existente
          savedTask = await this.taskModel.updateTask(this.currentTask._id, this.currentTask);
          
          // Actualizar la tarea en el array local
          const index = this.tasks.findIndex(task => task._id === savedTask._id);
          if (index !== -1) {
            this.tasks[index] = savedTask;
          }
          
          this.successMessage = 'Tasca actualitzada correctament!';
        } else {
          // Crear nueva tarea
          savedTask = await this.taskModel.createTask(this.currentTask);
          
          // Añadir la tarea al array local al principio
          this.tasks.unshift(savedTask);
          
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
      // Crear una nueva instancia de Task para evitar modificar la original directamente
      this.currentTask = new Task(task);
      this.editMode = true;
    },

    async deleteTask(id) {
      if (confirm('Estàs segur que vols eliminar aquesta tasca?')) {
        try {
          await this.taskModel.deleteTask(id);
          
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
        
        // Utilizar el método de la clase Task para completar
        taskToComplete.complete();
        
        const result = await this.taskModel.updateTask(id, taskToComplete);
        
        // Actualizar la tarea en el array local
        const index = this.tasks.findIndex(task => task._id === id);
        if (index !== -1) {
          this.tasks[index] = result;
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
    }
  },
  mounted() {
    this.loadTasks();
    
    // Configurar un refresco periòdic (cada 30 segons)
    setInterval(() => {
      this.loadTasks();
    }, 30000);
  }
};
</script>

<style>
/* Estilos globales */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f9;
}

h1, h2, h3 {
  color: #333;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Estilos del contenedor principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Estilos del formulario de tareas */
.task-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.task-form .form-group {
  margin-bottom: 15px;
}

.task-form label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.task-form input[type="text"],
.task-form input[type="date"],
.task-form select,
.task-form textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.task-form textarea {
  resize: vertical;
}

.task-form .form-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.task-form .btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.task-form .btn.primary {
  background-color: #007bff;
  color: #fff;
}

.task-form .btn.secondary {
  background-color: #6c757d;
  color: #fff;
  margin-left: 10px;
}

/* Estilos de la lista de tareas */
.task-list {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-list .filters {
  margin-bottom: 15px;
}

.task-list .filters button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.task-list .filters button.active {
  background-color: #007bff;
  color: #fff;
}

.task-list .task-summary {
  margin-bottom: 15px;
  font-size: 16px;
}

.task-list .task-summary span {
  margin-right: 20px;
}

.task-list .success-message,
.task-list .error-message,
.task-list .loading,
.task-list .no-tasks {
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.task-list .success-message {
  background-color: #d4edda;
  color: #155724;
}

.task-list .error-message {
  background-color: #f8d7da;
  color: #721c24;
}

.task-list .loading {
  color: #007bff;
}

.task-list .no-tasks {
  color: #6c757d;
}

.task-list .tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list .tasks {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Estilos del footer */
footer {
  background-color: #343a40;
  color: #fff;
  text-align: center;
  padding: 10px 0;
  position: relative;
  bottom: 0;
  width: 100%;
}

footer p {
  margin: 0;
  font-size: 14px;
}
</style>
