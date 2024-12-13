class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;

        this.view.bindFileUpload(this.handleFileUpload);
        this.view.bindAddGroup(this.handleAddGroup);
        this.view.bindAddIngredient(this.handleAddIngredient);
        this.view.bindRemoveIngredient(this.handleRemoveIngredient);
        this.view.bindRemoveGroup(this.handleRemoveGroup);
    }

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

    handleAddGroup = () => {
        const groupName = '';
        const index = this.model.addGroup(groupName);
        this.view.addGroupToDOM(groupName, index);
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

    handleRemoveGroup = (groupIndex) => {
        this.model.removeGroup(groupIndex);
        this.view.removeGroup(groupIndex);
    }
}
