class View {
    constructor() {
        this.content = document.getElementById('content');
    }

    render(items) {
        this.content.innerHTML = '';
        if (items.length === 0) {
            this.content.innerHTML = '<p>No items found</p>';
            return;
        }

        const ul = document.createElement('ul');
        items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name}: ${item.description}`;
            ul.appendChild(li);
        });
        this.content.appendChild(ul);
    }

    showError(message) {
        this.content.innerHTML = `<p class="error">${message}</p>`;
    }
}