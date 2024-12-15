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

}

const databaze = new Database();
