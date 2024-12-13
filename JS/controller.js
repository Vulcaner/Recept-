class Controller {
    constructor(model, view){
        this.model = model;
        this.view = view;

        this.view.bindFileUpload(this.handleFileUpload);
        this.view.bindAddGroup(this.handleAddGroup);
        this.view.bindAddIngredient(this.handleAddIngredient);
        this.view.bindRemoveIngredient(this.handleRemoveIngredient);
        this.view.bindRemoveGroup(this.handleRemoveGroup);
        this.view.bindFormSubmit(this.handleFormSubmit);
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

    handleFormSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const nazevReceptu = formData.get('nazev_receptu');
        const dobaPripravy = parseInt(formData.get('doba_pripravy'), 10);
        const denniDobro = formData.get('denni_dobro');
        const druhKuchyne = formData.get('druh_kuchyne');
        const typJidla = formData.get('typ_jidla');
        const foto = formData.get('foto');
        const postup = formData.get('postup');

        const groups = this.model.groups.map(group => ({
            name: group.name,
            ingredients: group.ingredients
        }));

        const recipe = {
            nazev: nazevReceptu,
            dobaPripravy: dobaPripravy,
            denniDobro: denniDobro,
            druhKuchyne: druhKuchyne,
            typJidla: typJidla,
            postup: postup,
            ingredience: groups,
            foto: null
        };

        if (foto && foto.size > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                recipe.foto = reader.result;
                this.saveRecipe(recipe);
            };
            reader.readAsDataURL(foto);
        } else {
            this.saveRecipe(recipe);
        }
    }

    saveRecipe = (recipe) => {
        databaze.addRecipe(recipe).then(() => {
            alert('Recept byl úspěšně uložen!');
            this.view.resetForm();
        }).catch((error) => {
            console.error('Chyba při ukládání receptu:', error);
            this.view.showError('Chyba při ukládání receptu. Zkuste to prosím znovu.');
        });
    }

    handleShowRecipes = () => {
        window.location.href = 'recepty.html';
    }
}
