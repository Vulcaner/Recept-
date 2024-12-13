class View {
    constructor() {
        // Obrázek
        this.previewBox = document.querySelector('.image-preview-placeholder');
        this.uploadInput = document.getElementById('upload_foto');

        // Ingredience
        this.ingredienceContainer = document.getElementById('ingredience-container');
        this.addIngredientBtn = document.getElementById('pridej-ingredienci');
        this.addGroupBtn = document.getElementById('pridej-skupinu-ingredienci');
    }

    // ===== Obrázek (původní logika) =====
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
        this.uploadInput.value = ''; // reset výběru souboru
    }

    resetPreview() {
        this.previewBox.innerHTML = 'Zatím není vložen žádný obrázek';
    }

    // ===== Ingredience (nová logika) =====
    bindAddIngredient(handler) {
        this.addIngredientBtn.addEventListener('click', () => {
            const groups = this.getGroups();
            if(groups.length > 0) {
                const groupIndex = groups.length - 1; 
                handler(groupIndex);
            } else {
                alert("Nejprve přidejte skupinu ingrediencí.");
            }
        });
    }

    bindAddGroup(handler) {
        this.addGroupBtn.addEventListener('click', () => {
            handler();
        });
    }

    bindRemoveIngredient(handler) {
        this.ingredienceContainer.addEventListener('click', (e) => {
            if(e.target.closest('.krizek')) {
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

    createGroupElement(groupName='') {
        const div = document.createElement('div');
        div.classList.add('skupina-ingredienci');
        div.innerHTML = `
            <input type="text" name="skupina_ingredienci" placeholder="Skupina ingrediencí (hlavní jídlo, příloha, omáčka, ...)" value="${groupName}">
        `;
        return div;
    }

    addGroupToDOM(groupName) {
        const groupEl = this.createGroupElement(groupName);
        // Přidáme defaultně jednu ingredienci
        const ingredientLine = this.createIngredientLine();
        groupEl.appendChild(ingredientLine);
        this.ingredienceContainer.appendChild(groupEl);
    }

    addIngredientToGroup(groupIndex, ingredient) {
        const groups = this.ingredienceContainer.querySelectorAll('.skupina-ingredienci');
        const groupEl = groups[groupIndex];
        const line = this.createIngredientLine(ingredient.name, ingredient.amount, ingredient.unit);
        groupEl.appendChild(line);
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
}
