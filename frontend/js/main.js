document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    const viewModel = new ViewModel(model, view);
    
    viewModel.initialize();
});