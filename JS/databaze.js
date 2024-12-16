class Database {
    constructor() {
        this.dbName = 'ReceptarDB';
        this.dbVersion = 2;
        this.db = null;
        this.openPromise = this.open();
    }

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('onupgradeneeded:', db.objectStoreNames);
                if (!db.objectStoreNames.contains('recepty')) {
                    const objectStore = db.createObjectStore('recepty', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('nazev', 'nazev', { unique: false });
                    console.log('Object store "recepty" vytvořen.');
                } else {
                    console.log('Object store "recepty" již existuje.');
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('Databáze úspěšně otevřena');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při otevírání databáze:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    async addRecipe(recipe) {
        await this.openPromise;
        console.log('Přidávání receptu do databáze:', recipe);
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readwrite');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.add(recipe);

            request.onsuccess = () => {
                console.log('Recept úspěšně přidán do databáze.');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při ukládání receptu do databáze:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getAllRecepty() {
        await this.openPromise;
        console.log('Načítání všech receptů z databáze');
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readonly');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                console.log('Recepty načteny z databáze:', request.result);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Chyba při načítání receptů z databáze.');
                reject('Chyba při načítání receptů.');
            };
        });
    }

    async getRecept(id) {
        await this.openPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readonly');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.get(id);

            request.onsuccess = () => {
                const result = request.result;
                if (result) {
                    console.log('Recept načten z databáze:', result);
                    resolve(result);
                } else {
                    console.error(`Recept s ID ${id} nebyl nalezen.`);
                    reject(`Recept s ID ${id} nebyl nalezen.`);
                }
            };

            request.onerror = () => {
                console.error('Chyba při načítání receptu z databáze.');
                reject('Chyba při načítání receptu.');
            };
        });
    }

    async updateRecept(id, updatedRecipe) {
        await this.openPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readwrite');
            const objectStore = transaction.objectStore('recepty');
            const getRequest = objectStore.get(id);

            getRequest.onsuccess = () => {
                const data = getRequest.result;
                if (!data) {
                    reject('Recept nenalezen.');
                    return;
                }

                const updatedData = { ...data, ...updatedRecipe };
                const updateRequest = objectStore.put(updatedData);

                updateRequest.onsuccess = () => {
                    console.log(`Recept s ID ${id} úspěšně aktualizován.`);
                    resolve();
                };

                updateRequest.onerror = (event) => {
                    console.error('Chyba při aktualizaci receptu:', event.target.error);
                    reject(event.target.error);
                };
            };

            getRequest.onerror = (event) => {
                console.error('Chyba při získávání receptu pro aktualizaci:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async deleteRecept(id) {
        await this.openPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readwrite');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                console.log(`Recept s ID ${id} úspěšně smazán.`);
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při mazání receptu:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}

const databaze = new Database();
