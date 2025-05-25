/**
 * TaskModel: Servicio para interactuar con la API de tareas
 * Implementa el patrón Repository para acceder a los datos
 */
import { Task } from '../models/Task';

export class TaskModel {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3009/api';
  }

  /**
   * Fetch all tasks from the API
   * @returns {Promise<Array<Task>>} - Promise that resolves to an array of Task instances
   */
  async getAllTasks() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tasksData = await response.json();
      // Convertir los datos a instancias de Task
      return tasksData.map(taskData => Task.fromApiData(taskData));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  /**
   * Fetch a single task by ID
   * @param {string} id - The task ID
   * @returns {Promise<Task>} - Promise that resolves to a Task instance
   */
  async getTaskById(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const taskData = await response.json();
      return Task.fromApiData(taskData);
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new task
   * @param {Task} task - The Task instance to create
   * @returns {Promise<Task>} - Promise that resolves to the created Task
   */
  async createTask(task) {
    try {
      console.log("Sending request to create task:", task);
      
      const response = await fetch(`${this.apiBaseUrl}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task.toJSON()),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const createdTaskData = await response.json();
      const createdTask = Task.fromApiData(createdTaskData);
      createdTask.isNew = true;
      
      console.log("Task created successfully:", createdTask);
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   * @param {string} id - The ID of the task to update
   * @param {Task} task - The Task instance with updated data
   * @returns {Promise<Task>} - Promise that resolves to the updated Task
   */
  async updateTask(id, task) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task.toJSON()),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTaskData = await response.json();
      return Task.fromApiData(updatedTaskData);
    } catch (error) {
      console.error(`Error updating task with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a task by ID
   * @param {string} id - The ID of the task to delete
   * @returns {Promise<Object>} - Promise that resolves to the response data
   */
  async deleteTask(id) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error deleting task with ID ${id}:`, error);
      throw error;
    }
  }
}
