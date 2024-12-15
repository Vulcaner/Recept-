// JS/databaze.js
class Database {
    constructor() {
        this.dbName = 'ReceptarDB';
        this.dbVersion = 2; // Zvýšení verze na 2 pro spuštění onupgradeneeded
        this.db = null;
        this.openPromise = this.open(); // Inicializace openPromise v konstruktoru
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
                    // Přidání dalších indexů, pokud je potřeba
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
        await this.openPromise; // Čeká na otevření databáze
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readwrite');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.add(recipe);

            request.onsuccess = () => {
                console.log('Recept úspěšně přidán.');
                resolve();
            };

            request.onerror = (event) => {
                console.error('Chyba při ukládání receptu:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async getAllRecepty() {
        await this.openPromise; // Čeká na otevření databáze
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['recepty'], 'readonly');
            const objectStore = transaction.objectStore('recepty');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject('Chyba při načítání receptů.');
            };
        });
    }

    // Další CRUD metody (getRecept, updateRecept, deleteRecept) mohou být přidány podobně
}

const databaze = new Database();
// Není třeba volat open() explicitně, je již voláno v konstruktoru
// databaze.open().then(() => {
//     console.log('Databáze úspěšně otevřena');
// }).catch((error) => {
//     console.error('Chyba při otevírání databáze:', error);
// });
