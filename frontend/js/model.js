/**
 * Model for the Task Manager application
 * Handles all API calls and data operations
 */
class TaskModel {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3009/api';
    }

    /**
     * Fetch all tasks from the API
     * @returns {Promise<Array>} - Promise that resolves to an array of tasks
     */
    async getAllTasks() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    /**
     * Fetch a single task by ID
     * @param {string} id - The task ID
     * @returns {Promise<Object>} - Promise that resolves to the task object
     */
    async getTaskById(id) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching task with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new task
     * @param {Object} task - The task object to create
     * @returns {Promise<Object>} - Promise that resolves to the created task
     */
    async createTask(task) {
        try {
            console.log("Sending request to create task:", task);
            
            const response = await fetch(`${this.apiBaseUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("API error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const createdTask = await response.json();
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
     * @param {Object} task - The updated task data
     * @returns {Promise<Object>} - Promise that resolves to the updated task
     */
    async updateTask(id, task) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
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
