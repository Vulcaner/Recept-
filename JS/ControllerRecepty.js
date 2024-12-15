// JS/ControllerRecepty.js
class ControllerRecepty {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async init() {
        await this.loadRecepty();
    }

    async loadRecepty() {
        try {
            const recepty = await this.model.getAllRecepty();
            this.view.renderRecepty(recepty);
        } catch (error) {
            console.error('Chyba při načítání receptů:', error);
            this.view.showError('Chyba při načítání receptů.');
        }
    }
}
