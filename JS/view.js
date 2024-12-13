class View {
    constructor() {
        this.previewBox = document.querySelector('.image-preview-placeholder');
        this.uploadInput = document.getElementById('upload_foto');

        this.ingredienceContainer = document.getElementById('ingredience-container');
        this.addGroupBtn = document.getElementById('pridej-skupinu-ingredienci');
        this.form = document.getElementById('formular');
        this.errorContainer = document.createElement('div');
        this.errorContainer.classList.add('error-message');
        this.form.insertBefore(this.errorContainer, this.form.firstChild);
    }


    bindFileUpload(handler) {
        this.uploadInput.addEventListener('change', () => {
            const file = this.uploadInput.files[0];
            handler(file);
        });
    }

    showImage(fileURL) {
        this.previewBox.innerHTML = '';
        const img = document.createElement('img');
        img.src = fileURL;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        this.previewBox.appendChild(img);
    }

    showError(message) {
        alert(message);
        this.uploadInput.value = ''; 
    }

    resetPreview() {
        this.previewBox.innerHTML = 'Zatím není vložen žádný obrázek';
    }

    bindAddGroup(handler) {
        this.addGroupBtn.addEventListener('click', () => {
            handler();
        });
    }

    bindAddIngredient(handler) {
        this.ingredienceContainer.addEventListener('click', (e) => {
            if(e.target.classList.contains('pridej-ingredienci-group')) {
                const groupEl = e.target.closest('.skupina-ingredienci');
                const groups = Array.from(this.ingredienceContainer.querySelectorAll('.skupina-ingredienci'));
                const groupIndex = groups.indexOf(groupEl);
                handler(groupIndex);
            }
        });
    }

    bindRemoveIngredient(handler) {
        this.ingredienceContainer.addEventListener('click', (e) => {
            if(e.target.closest('.krizek') && e.target.closest('.ingredient-line')) {
                const line = e.target.closest('.ingredient-line');
                const groupEl = e.target.closest('.skupina-ingredienci');
                const groups = Array.from(this.ingredienceContainer.querySelectorAll('.skupina-ingredienci'));
                const groupIndex = groups.indexOf(groupEl);
                const lines = Array.from(groupEl.querySelectorAll('.ingredient-line'));
                const lineIndex = lines.indexOf(line);
                handler(groupIndex, lineIndex);
            }
        });
    }

    bindRemoveGroup(handler) {
        this.ingredienceContainer.addEventListener('click', (e) => {
            if(e.target.closest('.krizek-group')) {
                const groupEl = e.target.closest('.skupina-ingredienci');
                const groups = Array.from(this.ingredienceContainer.querySelectorAll('.skupina-ingredienci'));
                const groupIndex = groups.indexOf(groupEl);
                handler(groupIndex);
            }
        });
    }

    createIngredientLine(name='', amount='', unit='ks') {
        const div = document.createElement('div');
        div.classList.add('ingredient-line');
        div.innerHTML = `
            <input type="text" name="nazev_ingredience" placeholder="Název" value="${name}">
            <input type="number" name="mnozstvi" placeholder="Množství" min="1" value="${amount}">
            <select name="mnozstvi_id">
                <option${unit==='ks'?' selected':''}>ks</option>
                <option${unit==='g'?' selected':''}>g</option>
                <option${unit==='kg'?' selected':''}>kg</option>
                <option${unit==='ml'?' selected':''}>ml</option>
                <option${unit==='l'?' selected':''}>l</option>
                <option${unit==='balení'?' selected':''}>balení</option>
                <option${unit==='balíček'?' selected':''}>balíček</option>
                <option${unit==='hrnek'?' selected':''}>hrnek</option>
                <option${unit==='špetka'?' selected':''}>špetka</option>
                <option${unit==='stroužek'?' selected':''}>stroužek</option>
            </select>
            <div class="krizek">
                <img src="obrazky/kriz.png" alt="Smazat">
            </div>
        `;
        return div;
    }

    createGroupElement(groupName='', groupIndex=0) {
        const div = document.createElement('div');
        div.classList.add('skupina-ingredienci');

        div.innerHTML = `
            <div class="group-header">
                <input type="text" name="skupina_ingredienci" placeholder="Skupina ingrediencí (hlavní jídlo, příloha, omáčka, ...)" value="${groupName}">
                <div class="krizek-group">
                    <img src="obrazky/kriz.png" alt="Smazat skupinu">
                </div>
            </div>
        `;

        return div;
    }

    addGroupToDOM(groupName, groupIndex) {
        const groupEl = this.createGroupElement(groupName, groupIndex);
        const ingredientLine = this.createIngredientLine();
        groupEl.appendChild(ingredientLine);

        const addIngredientDiv = document.createElement('div');
        addIngredientDiv.classList.add('div-pridani-group');
        addIngredientDiv.innerHTML = `<button class="pridej-ingredienci-group">Přidej ingredienci</button>`;
        groupEl.appendChild(addIngredientDiv);

        this.ingredienceContainer.appendChild(groupEl);
    }

    addIngredientToGroup(groupIndex, ingredient) {
        const groups = this.ingredienceContainer.querySelectorAll('.skupina-ingredienci');
        const groupEl = groups[groupIndex];
        const line = this.createIngredientLine(ingredient.name, ingredient.amount, ingredient.unit);
        groupEl.insertBefore(line, groupEl.querySelector('.div-pridani-group'));
    }

    getGroups() {
        return Array.from(this.ingredienceContainer.querySelectorAll('.skupina-ingredienci'));
    }

    removeIngredientLine(groupIndex, lineIndex) {
        const groups = this.ingredienceContainer.querySelectorAll('.skupina-ingredienci');
        const groupEl = groups[groupIndex];
        const lines = groupEl.querySelectorAll('.ingredient-line');
        if(lines[lineIndex]) {
            lines[lineIndex].remove();
        }
    }

    removeGroup(groupIndex) {
        const groups = this.ingredienceContainer.querySelectorAll('.skupina-ingredienci');
        if(groups[groupIndex]) {
            groups[groupIndex].remove();
        }
    }

    bindFormSubmit(handler) {
        this.form.addEventListener('submit', handler);
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
        this.form.querySelector('input[name="foto"]').value = '';
        setTimeout(() => {
            this.errorContainer.style.display = 'none';
            this.errorContainer.textContent = '';
        }, 5000);
    }

    resetForm() {
        this.form.reset();
        this.resetPreview();
    }
}
