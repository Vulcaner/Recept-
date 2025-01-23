# Receptář: Webová aplikace pro správu receptů

## Popis projektu

Webová aplikace **Receptář** umožňuje uživatelům vytvářet, ukládat, zobrazovat a spravovat recepty. Data jsou ukládána do **IndexedDB**, což umožňuje offline použití. Aplikace má uživatelské rozhraní pro přidávání receptů a zobrazení uložených receptů.

---

## Funkční specifikace

### Datový konceptuální model

- **Recept:**
  - `id` (auto increment) – unikátní identifikátor receptu.
  - `nazev` (string) – název receptu.
  - `dobaPripravy` (string) – čas přípravy.
  - `denniDobro` (string) – zařazení receptu dle denní doby (např. snídaně, oběd).
  - `druhKuchyne` (string) – typ kuchyně (česká, asijská atd.).
  - `typJidla` (string) – typ jídla (polévka, dezert atd.).
  - `ingredience` (array):
    - `name` (string) – název ingredience.
    - `amount` (integer) – množství.
    - `unit` (string) – jednotka (např. g, ks, l).
  - `postup` (string) – postup přípravy.
  - `foto` (string) – URL nebo Base64 obrázku.

### Charakteristika funkcionalit

1. **Vložení nového receptu:**
   - Uživatel může přidat název, čas přípravy, typ kuchyně, ingredience a postup.
   - Možnost nahrání obrázku receptu.
2. **Zobrazení uložených receptů:**
   - Seznam všech uložených receptů v přehledném formátu.
3. **Editace a mazání receptů:**
   - Možnost aktualizace existujícího receptu.
   - Možnost odstranění receptu.
4. **Práce s ingrediencemi:**
   - Organizace ingrediencí do skupin (např. hlavní jídlo, příloha).

### Uživatelské role a oprávnění

- **Běžný uživatel:**
  - Přidávání, editace, a mazání receptů.
  - Zobrazení seznamu receptů.

---

## Uživatelské grafické rozhraní

### Hlavní stránky:

1. **index.html:**
   - Formulář pro vytvoření nového receptu.
   - Funkce pro nahrání obrázku a přidání ingrediencí.
   - Tlačítko pro uložení receptu.
   - Odkaz na zobrazení uložených receptů.
2. **recepty.html:**
   - Seznam uložených receptů.
   - Možnost úpravy a mazání jednotlivých receptů.

### Funkčnost uživatelského rozhraní:

- Dynamické přidávání/odebírání ingrediencí.
- Náhled nahraného obrázku.
- Modální okno pro úpravu existujícího receptu.

---

## Technická specifikace

### Datový logický model

- Ukládání dat do **IndexedDB** (databáze `ReceptarDB`, verze 2).
- Tabulka `recepty` s klíčem `id` a indexem `nazev`.

### Architektura aplikace

Aplikace je navržena dle **MVC (Model-View-Controller)** principu:

1. **Model (`model.js`):**
   - Zpracování logiky práce s recepty a validace souborů.
   - Komunikace s IndexedDB skrze třídu `Database`.
2. **View:**
   - `view.js`: Zajišťuje interakce s formulářem pro přidávání receptů.
   - `ViewRecepty.js`: Vykresluje seznam receptů.
3. **Controller:**
   - `controller.js`: Řídí akce na hlavní stránce (`index.html`).
   - `ControllerRecepty.js`: Spravuje akce na stránce s uloženými recepty (`recepty.html`).

### Použité technologie

- **HTML5** a **CSS3** pro strukturu a stylování.
- **JavaScript** pro dynamickou interakci a logiku aplikace.
- **IndexedDB** pro ukládání dat na straně klienta.
- **FileReader API** pro nahrání a zpracování obrázků.

---

## Ovládání aplikace

Aplikace se ovládá stejně jako ostatní receptáře, které jsou již veřejně dostupné. Uživatel má možnost zadat několik informací, které by recept měl mít:

- **Název**
- **Čas přípravy**
- **Denní zařazení** (snídaně, oběd, …)
- **Druh kuchyně** (česká, asijská, …)
- **Typ jídla** (polévka, omáčka, maso, …)
- **Přidání obrázku** pro vizuální potěšení

V sekci „Přidání ingrediencí“ si může uživatel navolit jak skupiny ingrediencí (korpus, náplň apod.), tak samotné ingredience (mouka, cukr apod.). Tato sekce je dělána dynamicky a umožňuje uživateli přidat více skupin ingrediencí a pro každou skupinu může uživatel přidat více samostatných ingrediencí.

U ingrediencí je potřeba vyplnit název, množství a typ množství (kg, l, balíček, hrnek apod.)

V poslední části aplikace je sekce „Postup přípravy receptu“, která slouží pro podrobný popis, jak recept uvařit/upéct.

Po kliknutí na tlačítko „Uložit recept“ se recept uloží do indexované databáze, tudíž by data měla být dostupná i pro offline použití.

Kliknutí na tlačítko „Zobrazit uložené recepty“ odkáže na stránku `recepty.html`, která obsahuje všechny uložené recepty. Na této stránce je možné recepty editovat a případně mazat.

---

## Věci ke zlepšení

- Intuitivnější editování ingrediencí u uložených receptů
- Filtrovací možnosti v horní části stránky pro rychlejší dohledávání receptů
- Předělání formuláře tak, aby se při přidání nové skupiny ingrediencí a dalších ingrediencí nechovalo jako odesílací tlačítko
- Více upravené editovací okno pro menší obrazovky

---

**BcA. Jaroslav Zbraněk**
