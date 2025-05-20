class ViewModel {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async initialize() {
        try {
            const items = await this.model.fetchItems();
            this.view.render(items);
        } catch (error) {
            this.view.showError('Failed to load items');
        }
    }

    async addItem(item) {
        try {
            await this.model.addItem(item);
            await this.initialize();
        } catch (error) {
            this.view.showError('Failed to add item');
        }
    }
}