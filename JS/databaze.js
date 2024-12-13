class Database {
    constructor() {
        this.dbName = 'ReceptarDB';
        this.dbVersion = 1;
        this.db = null;
    }

    open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('recepty')) {
                    const objectStore = db.createObjectStore('recepty', { keyPath: 'id', autoIncrement: true });
                    objectStore.createIndex('nazev', 'nazev', { unique: false });
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při otevírání databáze:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

    addRecipe(recipe) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readwrite');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.add(recipe);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při ukládání receptu:', event.target.error);
                reject(event.target.error);
            };
        });
    }
}

const databaze = new Database();
databaze.open().then(() => {
    console.log('Databáze úspěšně otevřena');
}).catch((error) => {
    console.error('Chyba při otevírání databáze:', error);
});
