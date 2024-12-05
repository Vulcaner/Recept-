class MojeDB {
    #db;
    #verze = 1;
    #dbNazev = 'wwwap2024ks';
    #nazevOsStudenti = "studenti";
    #dbRequest;

    constructor() {
        
        /// pristup k DB ///
        this.#dbRequest = indexedDB.open(this.#dbNazev, this.#verze);

        // upgrade/vytvoreni database
        this.#dbRequest.onupgradeneeded = (event) => this.upgradeDB(event);
        this.#dbRequest.onsuccess = (event) => this.onsuccess(event);
        this.#dbRequest.onerror = function(event) {
            console.log("Něco špatně: ", event.target);
        };
    }

    upgradeDB(ev) {
        console.log("db upgrading");
        this.#db = ev.target.result; //this.#dbRequest.result;
        /// vytvoreni "tabulky" studenti
        const studentiStore = this.#db.createObjectStore(this.#nazevOsStudenti, { keyPath: "id", autoIncrement: true });
        // index pro moznost vypisu dle razeni dle prijmeni
        studentiStore.createIndex('prijmeniIndex', 'prijmeni');
    }

    onsuccess(ev) {
        console.log("db otevrena");
        this.#db = ev.target.result; //this.#dbRequest.result;
        this.#db.onerror = function(ev) {
            console.log("db error: ", ev.target.errorCode);
        };               
    }        
}

window.onload = () => {
    const DB = new MojeDB();    
}
