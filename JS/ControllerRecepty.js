class ControllerRecepty {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSaveEdit = this.handleSaveEdit.bind(this);
    }

    async init() {
        await this.loadRecepty();
        this.addEventListeners();
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

    addEventListeners() {
        this.view.receptyContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-button')) {
                this.handleDelete(event);
            } else if (event.target.classList.contains('edit-button')) {
                this.handleEdit(event);
            }
        });
    }

    async handleDelete(event) {
        const id = this.view.getReceptId(event.target);
        console.log('Mazání receptu s ID:', id);
    
        if (id === null || isNaN(id)) {
            this.view.showError('ID receptu nebylo nalezeno.');
            return;
        }
    
        if (confirm('Opravdu chceš smazat tento recept?')) {
            try {
                await this.model.deleteRecept(id);
                console.log(`Recept s ID ${id} byl úspěšně smazán.`);
                await this.loadRecepty();
            } catch (error) {
                console.error('Chyba při mazání receptu:', error);
                this.view.showError('Chyba při mazání receptu.');
            }
        }
    }

    async handleEdit(event) {
        const id = this.view.getReceptId(event.target);
        if (id === null) {
            this.view.showError('ID receptu nebylo nalezeno.');
            return;
        }

        try {
            const recept = await this.model.getRecept(id);
            if (!recept) {
                this.view.showError('Recept nebyl nalezen.');
                return;
            }

            this.showEditForm(recept);
        } catch (error) {
            console.error('Chyba při načítání receptu pro editaci:', error);
            this.view.showError('Chyba při načítání receptu pro editaci.');
        }
    }


showEditForm(recept) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Editace receptu</h2>
            <form id="edit-form">
                <div class="pair">
                    <label for="nazev">Název:</label>
                    <input type="text" name="nazev" id="nazev" value="${recept.nazev}" required>
                </div>

                <div class="pair">
                    <label for="dobaPripravy">Čas přípravy:</label>
                    <select name="dobaPripravy" id="dobaPripravy" required>
                        <option value="1" ${recept.dobaPripravy === "1" ? "selected" : ""}>1 minuta</option>
                        <option value="2" ${recept.dobaPripravy === "2" ? "selected" : ""}>2 minuty</option>
                        <option value="5" ${recept.dobaPripravy === "5" ? "selected" : ""}>5 minut</option>
                        <option value="10" ${recept.dobaPripravy === "10" ? "selected" : ""}>10 minut</option>
                        <option value="15" ${recept.dobaPripravy === "15" ? "selected" : ""}>15 minut</option>
                        <option value="30" ${recept.dobaPripravy === "30" ? "selected" : ""}>30 minut</option>
                        <option value="45" ${recept.dobaPripravy === "45" ? "selected" : ""}>45 minut</option>
                        <option value="60" ${recept.dobaPripravy === "60" ? "selected" : ""}>1 hodina</option>
                        <option value="75" ${recept.dobaPripravy === "75" ? "selected" : ""}>1 hodina 15 minut</option>
                        <option value="90" ${recept.dobaPripravy === "90" ? "selected" : ""}>1 hodina 30 minut</option>
                        <option value="105" ${recept.dobaPripravy === "105" ? "selected" : ""}>1 hodina 45 minut</option>
                        <option value="120" ${recept.dobaPripravy === "120" ? "selected" : ""}>2 hodiny</option>
                        <option value="135" ${recept.dobaPripravy === "135" ? "selected" : ""}>2 hodiny 15 minut</option>
                        <option value="150" ${recept.dobaPripravy === "150" ? "selected" : ""}>2 hodiny 30 minut</option>
                        <option value="165" ${recept.dobaPripravy === "165" ? "selected" : ""}>2 hodiny 45 minut</option>
                        <option value="180" ${recept.dobaPripravy === "180" ? "selected" : ""}>3 hodiny</option>
                        <option value="195" ${recept.dobaPripravy === "195" ? "selected" : ""}>3 hodiny 15 minut</option>
                        <option value="210" ${recept.dobaPripravy === "210" ? "selected" : ""}>3 hodiny 30 minut</option>
                        <option value="225" ${recept.dobaPripravy === "225" ? "selected" : ""}>3 hodiny 45 minut</option>
                        <option value="240" ${recept.dobaPripravy === "240" ? "selected" : ""}>4 hodiny</option>
                    </select>
                </div>

                <div class="pair">
                    <label for="denniDobro">Denní zařazení:</label>
                    <select name="denniDobro" id="denniDobro" required>
                        <option value="snidane" ${recept.denniDobro === "snidane" ? "selected" : ""}>Snídaně</option>
                        <option value="svacina" ${recept.denniDobro === "svacina" ? "selected" : ""}>Svačina</option>
                        <option value="obed" ${recept.denniDobro === "obed" ? "selected" : ""}>Oběd</option>
                        <option value="vecere" ${recept.denniDobro === "vecere" ? "selected" : ""}>Večeře</option>
                    </select>
                </div>

                <div class="pair">
                    <label for="druhKuchyne">Druh kuchyně:</label>
                    <select name="druhKuchyne" id="druhKuchyne" required>
                        <option value="ceska" ${recept.druhKuchyne === "ceska" ? "selected" : ""}>Česká</option>
                        <option value="indicka" ${recept.druhKuchyne === "indicka" ? "selected" : ""}>Indická</option>
                        <option value="asijska" ${recept.druhKuchyne === "asijska" ? "selected" : ""}>Asijská</option>
                        <option value="francouzska" ${recept.druhKuchyne === "francouzska" ? "selected" : ""}>Francouzská</option>
                    </select>
                </div>

                <div class="pair">
                    <label for="typJidla">Typ jídla:</label>
                    <select name="typJidla" id="typJidla" required>
                        <option value="polevka" ${recept.typJidla === "polevka" ? "selected" : ""}>Polévka</option>
                        <option value="maso" ${recept.typJidla === "maso" ? "selected" : ""}>Maso</option>
                        <option value="omacka" ${recept.typJidla === "omacka" ? "selected" : ""}>Omáčka</option>
                        <option value="testoviny" ${recept.typJidla === "testoviny" ? "selected" : ""}>Těstoviny</option>
                        <option value="moucnik" ${recept.typJidla === "moucnik" ? "selected" : ""}>Moučník</option>
                        <option value="dezert" ${recept.typJidla === "dezert" ? "selected" : ""}>Dezert</option>
                    </select>
                </div>

                <div class="pair">
                    <label for="ingredience">Ingredience:</label>
                    <textarea name="ingredience" id="ingredience" required>${JSON.stringify(recept.ingredience, null, 2)}</textarea>
                </div>

                <div class="pair">
                    <label for="postup">Postup:</label>
                    <textarea name="postup" id="postup" required>${recept.postup}</textarea>
                </div>

                <div class="pair">
                    <label for="foto">Aktuální Foto (URL):</label>
                    <input type="text" name="foto" id="foto" value="${recept.foto || ''}">
                </div>

                <div class="pair">
                    <label for="noveFoto">Nahrát nové Foto:</label>
                    <input type="file" name="noveFoto" id="noveFoto" accept="image/jpeg, image/png">
                    <img id="previewFoto" src="${recept.foto || ''}" alt="Náhled" style="max-width: 200px; margin-top: 10px; display: block;">
                </div>

                <div class="form-buttons">
                    <button type="button" id="cancel-edit">Zrušit</button>
                    <button type="submit">Uložit</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const fileInput = modal.querySelector('#noveFoto');
    const previewImg = modal.querySelector('#previewFoto');

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImg.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    modal.querySelector('#cancel-edit').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    modal.querySelector('#edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveEdit(e, recept.id, modal);
    });
}


async handleSaveEdit(event, id, modal) {
    const form = event.target;
    let ingredience;
    try {
        ingredience = JSON.parse(form.ingredience.value.trim());
    } catch (error) {
        this.view.showError('Ingredience musí být ve validním JSON formátu.');
        return;
    }

    const fileInput = modal.querySelector('#noveFoto');
    let foto = form.foto.value.trim();

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
            foto = reader.result;
            const updatedRecipe = {
                nazev: form.nazev.value.trim(),
                dobaPripravy: form.dobaPripravy.options[form.dobaPripravy.selectedIndex].text.trim(),
                denniDobro: form.denniDobro.options[form.denniDobro.selectedIndex].text.trim(),
                druhKuchyne: form.druhKuchyne.options[form.druhKuchyne.selectedIndex].text.trim(),
                typJidla: form.typJidla.options[form.typJidla.selectedIndex].text.trim(),
                ingredience: JSON.parse(form.ingredience.value.trim()),
                postup: form.postup.value.trim(),
                foto: foto
            };
    
            try {
                await this.model.updateRecept(id, updatedRecipe);
                document.body.removeChild(modal);
                await this.loadRecepty();
            } catch (error) {
                console.error('Chyba při ukládání aktualizovaného receptu:', error);
                this.view.showError('Chyba při ukládání aktualizovaného receptu.');
            }
        };
        reader.readAsDataURL(file);
    }
     else {
        const updatedRecipe = {
            nazev: form.nazev.value.trim(),
            dobaPripravy: form.dobaPripravy.options[form.dobaPripravy.selectedIndex].text.trim(),
            denniDobro: form.denniDobro.options[form.denniDobro.selectedIndex].text.trim(),
            druhKuchyne: form.druhKuchyne.options[form.druhKuchyne.selectedIndex].text.trim(),
            typJidla: form.typJidla.options[form.typJidla.selectedIndex].text.trim(),
            ingredience: JSON.parse(form.ingredience.value.trim()),
            postup: form.postup.value.trim(),
            foto: form.foto.value.trim() || null
        };

        try {
            await this.model.updateRecept(id, updatedRecipe);
            document.body.removeChild(modal);
            await this.loadRecepty();
        } catch (error) {
            console.error('Chyba při ukládání aktualizovaného receptu:', error);
            this.view.showError('Chyba při ukládání aktualizovaného receptu.');
        }
     }
    }
    
}
