class MojeDB {
    #db;
    #verze = 2;
    #dbNazev = 'wwwap2024ks';
    #nazevOsStudenti = "studenti";
    #dbRequest;

    constructor() {
        /// přístup k DB ///
        this.#dbRequest = indexedDB.open(this.#dbNazev, this.#verze);

        // upgrade/vytvoření databáze
        this.#dbRequest.onupgradeneeded = (event) => this.upgradeDB(event);
        this.#dbRequest.onsuccess = (event) => this.onsuccess(event);
        this.#dbRequest.onerror = function(event) {
            console.log("Něco špatně: ", event.target);
        };
    }

    upgradeDB(ev) {
        console.log("db upgrading");
        this.#db = ev.target.result; //this.#dbRequest.result;

        switch(ev.oldVersion){
            case 0 :
                /// vytvoření "tabulky" studenti
                const studentiStore = this.#db.createObjectStore(this.#nazevOsStudenti, { keyPath: "id", autoIncrement: true });
                // index pro možnost výpisu dle řazení dle příjmení
                studentiStore.createIndex('prijmeniIndex', 'prijmeni');

            case 1 : 
                const predmetStore = this.#db.createObjectStore("predmety", { keyPath: "id", autoIncrement: true });
                predmetStore.createIndex('nazevIndex', 'nazev');
        }
    }

    onsuccess(ev) {
        console.log("db otevřena");
        this.#db = ev.target.result; //this.#dbRequest.result;
        this.#db.onerror = function(ev) {
            console.log("db error: ", ev.target.errorCode);
        };
        this.vypisStudenty();
        this.naplnStudentyPredmety();
        this.naplnPredmety();               
    }

    vypisStudenty() {
        const trans = this.#db.transaction(this.#nazevOsStudenti, "readonly");
        trans.oncomplete = function(e) {
            console.log("Vše provedeno!");
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
                console.log(`ID: ${cursor.key}, příjmení: ${cursor.value.prijmeni}, jméno: ${cursor.value.jmeno}`);
                let tr = document.createElement('tr');
                
                let td = document.createElement('td');
                td.innerHTML = cursor.value.id;
                tr.appendChild(td);
                
                td = document.createElement('td');
                td.innerHTML = cursor.value.jmeno;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerHTML = cursor.value.prijmeni;
                tr.appendChild(td);

                stWrapper.appendChild(tr);

                cursor.continue();
            }
            else {
                console.log("Vše vypsáno.");
            }
        };
    }

    ulozPredmet(nazev) {
        const trans = this.#db.transaction("predmety", "readwrite");
        trans.oncomplete = (e) => {
            console.log("transakce UlozPredmet hotovo");            
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí UlozPredmet: " + e.target.errorCode);            
        };
        const tabPredmety = trans.objectStore("predmety");
        tabPredmety.add({'nazev' : nazev, 'studenti': []});
    }
    
    ulozStudenta(jmeno, prijmeni) {
        const trans = this.#db.transaction(this.#nazevOsStudenti, "readwrite");
        trans.oncomplete = (e) => {
            console.log("transakce hotovo"); 
            this.vypisStudenty();           
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí: " + e.target.errorCode);            
        };
        const objStore = trans.objectStore(this.#nazevOsStudenti);
        objStore.add({'jmeno' : jmeno, 'prijmeni' : prijmeni});        
    }

    PriradStudenta(student, predmet) {
        const trans = this.#db.transaction("predmety", "readwrite");
        trans.oncomplete = (e) => {
            console.log("transakce hotovo");           
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí: " + e.target.errorCode);            
        };   
    }

    naplnStudentyPredmety() {
        const trans = this.#db.transaction(["predmety", this.#nazevOsStudenti], "readonly");
        trans.oncomplete = (e) => {
            console.log("transakce hotovo");           
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí: " + e.target.errorCode);            
        };
        const osSt = trans.objectStore(this.#nazevOsStudenti);
        const osStIndex = osSt.index("prijmeniIndex");

        const selectStud = document.getElementById('student')
        osStIndex.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if(cursor) {
                const el = document.createElement('option');
                el.setAttribute('value', cursor.value.id);
                el.innerHTML = cursor.value.prijmeni + ", " + cursor.value.jmeno;
                selectStud.appendChild(el);
                cursor.continue();
            }
        };
    }

    naplnPredmety() {
        console.log("naplnPredmety called");
        const trans = this.#db.transaction("predmety", "readonly");
        trans.oncomplete = (e) => {
            console.log("transakce hotovo");           
        };
        trans.onerror = (e) => {
            console.log("Něco špatně s transakcí: " + e.target.errorCode);            
        };
        const osPredmety = trans.objectStore("predmety");
        const osPredmetyIndex = osPredmety.index("nazevIndex");

        const selectPredmet = document.getElementById('predmet');
        osPredmetyIndex.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if(cursor) {
                console.log(`Přidávám předmět: ${cursor.value.nazev}`);
                const el = document.createElement('option');
                el.setAttribute('value', cursor.value.id);
                el.innerHTML = cursor.value.nazev;
                selectPredmet.appendChild(el);
                cursor.continue();
            } else {
                console.log("Žádné další předměty k přidání");
            }
        };
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
    document.getElementById('priradit').addEventListener('click', (but) => {
        const st = document.getElementById('student').value;
        const pr = document.getElementById('predmet').value;
        if(st && pr) {
            DB.PriradStudenta(st, pr);
        }
    });
    document.getElementById('predmet-pridat').addEventListener('click', (but) => {
        const pr = document.getElementById('predmet').value;
        if(pr.length > 1) {
            DB.ulozPredmet(pr);
        }   
    });
};