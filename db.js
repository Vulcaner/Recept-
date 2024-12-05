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
        this.vypisStudenty();               
    }

    vypisStudenty() {
        const trans = this.#db.transaction(this.#nazevOsStudenti, "readonly");
        trans.oncomplete = function(e) {
            console.log("Vse provedeno!");
        };
        trans.onerror = function(e) {
            console.log("Něco špatně s transakcí: " + ev.target.errorCode);
            return false;
        };

        const objStore = trans.objectStore(this.#nazevOsStudenti);

        const stWrapper = document.getElementById('vypis-studenti');
        stWrapper.innerHTML = "";

        objStore.openCursor().onsuccess = function(event) {
            let cursor = event.target.result;
            if (cursor) {
                console.log(`ID: ${cursor.key}, prijmeni: ${cursor.value.prijmeni}, jmeno: ${cursor.value.jmeno}`);
                let tr = document.createElement('tr');
                
                let td = document.createElement('td');
                td.innerHTML = cursor.value.id;
                tr.appendChild(td);
                
                td = document.createElement('td');
                td.innerHTML = cursor.value.prijmeni;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = cursor.value.jmeno;
                tr.appendChild(td);

                stWrapper.appendChild(tr);

                cursor.continue();
            }
            else {
                console.log("Vše vypsáno.");
            }
        };
    }

    ulozStudenta(jmeno, prijmeni) {
        const trans = this.#db.transaction(this.#nazevOsStudenti, "readwrite");
        trans.oncomplete = (e) => {
            console.log("transakce hotovo");            
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí: " + ev.target.errorCode);            
        };
        const objStore = trans.objectStore(this.#nazevOsStudenti);
        objStore.add({'jmeno' : jmeno, 'prijmeni' : prijmeni});        
    }
}

window.onload = () => {
    const DB = new MojeDB();
    document.getElementById('student-pridat').addEventListener('click', (but) => {
        const jm = document.getElementById('jmeno').value;
        const pr = document.getElementById('prijmeni').value;
        if(jm.length > 1 && pr.length > 1) {
            DB.ulozStudenta(jm,pr);
        }
    });   
}
