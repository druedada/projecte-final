class Model {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.items = [];
    }

    async fetchItems() {
        try {
            const response = await fetch(this.apiUrl);
            this.items = await response.json();
            return this.items;
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    }

    async addItem(item) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding item:', error);
            return null;
        }
    }
}