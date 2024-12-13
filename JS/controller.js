class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Obrázek
        this.view.bindFileUpload(this.handleFileUpload);

        // Ingredience
        this.view.bindAddGroup(this.handleAddGroup);
        this.view.bindAddIngredient(this.handleAddIngredient);
        this.view.bindRemoveIngredient(this.handleRemoveIngredient);
    }

    // ===== Obrázek (původní logika) =====
    handleFileUpload = (file) => {
        const validation = this.model.validateFile(file);
        if (!validation.valid) {
            this.view.showError(validation.error);
            this.view.resetPreview();
            return;
        }

        const fileURL = URL.createObjectURL(file);
        this.view.showImage(fileURL);
    }

    // ===== Ingredience (nová logika) =====
    handleAddGroup = () => {
        const groupName = '';
        const index = this.model.addGroup(groupName);
        this.view.addGroupToDOM(groupName);
    }

    handleAddIngredient = (groupIndex) => {
        const ingredient = {name:'', amount:1, unit:'ks'};
        this.model.addIngredient(groupIndex, ingredient);
        this.view.addIngredientToGroup(groupIndex, ingredient);
    }

    handleRemoveIngredient = (groupIndex, lineIndex) => {
        this.model.removeIngredient(groupIndex, lineIndex);
        this.view.removeIngredientLine(groupIndex, lineIndex);
    }
}
