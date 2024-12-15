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
        console.log('Handling file upload:', file);
        const validation = this.model.validateFile(file);
        if (!validation.valid) {
            console.log('File validation failed:', validation.error);
            this.view.showError(validation.error);
            this.view.resetPreview();
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.view.showImage(reader.result);
            console.log('File uploaded successfully:', reader.result);
        };
        reader.readAsDataURL(file);
    }

    handleAddGroup = () => {
        console.log('Adding a new group');
        const groupName = '';
        const index = this.model.addGroup(groupName);
        this.view.addGroupToDOM(groupName, index);
        console.log(`Group added at index ${index}`);
    }

    handleAddIngredient = (groupIndex) => {
        console.log(`Adding ingredient to group at index ${groupIndex}`);
        const ingredient = {name:'', amount:1, unit:'ks'};
        this.model.addIngredient(groupIndex, ingredient);
        this.view.addIngredientToGroup(groupIndex, ingredient);
        console.log(`Ingredient added to group ${groupIndex}:`, ingredient);
    }

    handleRemoveIngredient = (groupIndex, lineIndex) => {
        console.log(`Removing ingredient at line ${lineIndex} from group ${groupIndex}`);
        this.model.removeIngredient(groupIndex, lineIndex);
        this.view.removeIngredientLine(groupIndex, lineIndex);
        console.log(`Ingredient removed from group ${groupIndex} at line ${lineIndex}`);
    }

    handleRemoveGroup = (groupIndex) => {
        console.log(`Removing group at index ${groupIndex}`);
        this.model.removeGroup(groupIndex);
        this.view.removeGroup(groupIndex);
        console.log(`Group at index ${groupIndex} removed`);
    }

    handleFormSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const form = event.target;

        const nazevReceptu = form.querySelector('input[name="nazev_receptu"]').value.trim();
        const dobaPripravySelect = form.querySelector('select[name="doba_pripravy"]');
        const denniDobroSelect = form.querySelector('select[name="denni_dobro"]');
        const druhKuchyneSelect = form.querySelector('select[name="druh_kuchyne"]');
        const typJidlaSelect = form.querySelector('select[name="typ_jidla"]');
        const postup = form.querySelector('textarea[name="postup"]').value.trim();
        const fotoInput = form.querySelector('input[name="foto"]');
        const foto = fotoInput.files[0];

        const dobaPripravy = dobaPripravySelect.options[dobaPripravySelect.selectedIndex].text.trim();
        const denniDobro = denniDobroSelect.options[denniDobroSelect.selectedIndex].text.trim();
        const druhKuchyne = druhKuchyneSelect.options[druhKuchyneSelect.selectedIndex].text.trim();
        const typJidla = typJidlaSelect.options[typJidlaSelect.selectedIndex].text.trim();

        console.log(`Nazev receptu: ${nazevReceptu}`);
        console.log(`Doba pripravy: ${dobaPripravy}`);
        console.log(`Denní zařazení: ${denniDobro}`);
        console.log(`Druh kuchyně: ${druhKuchyne}`);
        console.log(`Typ jídla: ${typJidla}`);
        console.log(`Postup: ${postup}`);

        const groups = [];
        const skupiny = this.view.ingredienceContainer.querySelectorAll('.skupina-ingredienci');
        skupiny.forEach((skupinaEl, groupIndex) => {
            const skupinaInput = skupinaEl.querySelector('input[name="skupina_ingredienci"]');
            const skupinaName = skupinaInput.value.trim();

            console.log(`Group ${groupIndex} name: ${skupinaName}`);

            const ingredients = [];
            const ingredientLines = skupinaEl.querySelectorAll('.ingredient-line');
            ingredientLines.forEach((ingredientEl, ingredientIndex) => {
                const nazev = ingredientEl.querySelector('input[name="nazev_ingredience"]').value.trim();
                const mnozstvi = parseInt(ingredientEl.querySelector('input[name="mnozstvi"]').value, 10);
                const mnozstvi_id = ingredientEl.querySelector('select[name="mnozstvi_id"]').value;

                console.log(`Group ${groupIndex}, Ingredient ${ingredientIndex}: ${nazev}, ${mnozstvi}, ${mnozstvi_id}`);

                ingredients.push({
                    name: nazev,
                    amount: mnozstvi,
                    unit: mnozstvi_id
                });
            });

            groups.push({
                name: skupinaName,
                ingredients: ingredients
            });
        });

        let missingNames = false;
        groups.forEach((group, groupIndex) => {
            if (!group.name) {
                missingNames = true;
                console.warn(`Missing group name at index ${groupIndex}`);
            }
            group.ingredients.forEach((ingredient, ingredientIndex) => {
                if (!ingredient.name) {
                    missingNames = true;
                    console.warn(`Missing ingredient name in group ${groupIndex}, ingredient ${ingredientIndex}`);
                }
            });
        });

        if (missingNames) {
            this.view.showError('Všechny názvy skupin a ingrediencí musí být vyplněny.');
            return;
        }

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

        console.log('Prepared recipe object:', recipe);

        if (foto && foto.size > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                recipe.foto = reader.result;
                console.log('Recipe with photo:', recipe);
                this.saveRecipe(recipe);
            };
            reader.readAsDataURL(foto);
        } else {
            console.log('Recipe without photo:', recipe);
            this.saveRecipe(recipe);
        }
    }

    saveRecipe = (recipe) => {
        console.log('Saving recipe to database:', recipe);
        this.model.addRecipe(recipe).then(() => {
            console.log('Recipe saved successfully');
            alert('Recept byl úspěšně uložen!');
            this.view.resetForm();
            this.model.clearGroups();
        }).catch((error) => {
            console.error('Error saving recipe:', error);
            this.view.showError('Chyba při ukládání receptu. Zkuste to prosím znovu.');
        });
    }

    handleShowRecipes = () => {
        console.log('Redirecting to recepty.html');
        window.location.href = 'recepty.html';
    }
}
