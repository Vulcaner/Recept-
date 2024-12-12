class Model {
    constructor() {
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        this.maxSize = 2 * 1024 * 1024;
    }

    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'Žádný soubor nebyl vybrán.' };
        }
        if (file.size > this.maxSize) {
            return { valid: false, error: 'Soubor je větší než 2MB, prosím vyberte menší soubor.' };
        }
        if (!this.allowedTypes.includes(file.type.toLowerCase())) {
            return { valid: false, error: 'Nepodporovaný formát. Vyberte prosím JPG, JPEG nebo PNG.' };
        }
        return { valid: true, error: null };
    }
}
