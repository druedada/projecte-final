/**
 * Main entry point for the Task Manager application
 * Initializes the MVVM architecture and starts the app
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Model
    const taskModel = new TaskModel();
    
    // Initialize the ViewModel with the Model
    const taskViewModel = new TaskViewModel(taskModel);
    
    // Initialize the View with the ViewModel
    const taskView = new TaskView(taskViewModel);
    
    // Mount the Vue application to the DOM
    taskView.mount('#app');
    
    console.log('Task Manager Application initialized');
});
