class ViewRecepty {
    constructor() {
        this.receptyContainer = document.getElementById('recepty-container');
    }

    renderRecepty(recepty) {
        this.receptyContainer.innerHTML = '';

        if (recepty.length === 0) {
            this.receptyContainer.innerHTML = '<p>Žádné recepty nejsou dostupné.</p>';
            return;
        }

        recepty.forEach(recept => {
            const receptDiv = document.createElement('div');
            receptDiv.classList.add('recept');
            receptDiv.setAttribute('data-id', recept.id);

            receptDiv.innerHTML = `
                <h3>${recept.nazev}</h3>
                <p><strong>Čas přípravy:</strong> ${recept.dobaPripravy}</p>
                <p><strong>Denní zařazení:</strong> ${this.capitalize(recept.denniDobro)}</p>
                <p><strong>Druh kuchyně:</strong> ${this.capitalize(recept.druhKuchyne)}</p>
                <p><strong>Typ jídla:</strong> ${this.capitalize(recept.typJidla)}</p>
                <p><strong>Ingredience:</strong> ${this.formatIngredience(recept.ingredience)}</p>
                <p><strong>Postup:</strong> ${recept.postup}</p>
                ${recept.foto ? `<img src="${recept.foto}" alt="${recept.nazev}" style="max-width: 200px; display: block; margin-top: 10px;">` : ''}
                <div class="button-container">
                    <button class="edit-button">Editovat</button>
                    <button class="delete-button">Smazat</button>
                </div>
            `;

            this.receptyContainer.appendChild(receptDiv);
        });
    }

    capitalize(text) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    formatIngredience(ingredience) {
        if (!ingredience || ingredience.length === 0) return 'Žádné';
        return ingredience.map(group => `${group.name}: ${group.ingredients.map(ing => `${ing.name} (${ing.amount} ${ing.unit})`).join(', ')}`).join(' | ');
    }

    showError(message) {
        alert(message);
    }

    getReceptId(element) {
        const receptDiv = element.closest('.recept');
        return receptDiv ? parseInt(receptDiv.getAttribute('data-id')) : null;
    }
}
