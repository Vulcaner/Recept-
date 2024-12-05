# Tvorba www aplikací
Repozitář pro potřeby výuky předmětu <b>Tvorba www aplikací</b>

## Práce s indexovanou DB - JavaScript
- API
- struktura DB, ObjectStore
- transakce, manipulace s daty
- zachytávání událostí

### Zadání
Vytvořte aplikaci, která bude umět přidávat studenty a předměty. Studenty bude možné potom přiřadit k jednotlivým předmětům.
1. Zpracujte přidávání studentů do již existující tabulky v Indexované DB
2. Připravte tabulku v DB pro ukládání předmětů a pro ukládání Předmět-Studenti
3. Zpracujte ukládání předmětů podobně jako u studentů
4. Zpracujte přiřazování studentů k předmětům a jejich zobrazení, viz:

<h3>Studenti</h3>
<table>
    <thead>
	<tr>
        <th>id</th>
        <th>Jmeno</th>
        <th>Prijmeni</th>
    </tr>
	<thead>
    <tbody id="vypis-studenti">
		<tr>
        <td>1</td>
        <td>Petr</td>
        <td>Burian</td>
        </tr>
    </tbody>
</table>

<h3>Studenti v předmětech</h3>
<table>
    <thead>
	<tr>
        <th>id</th>
        <th>Predmet</th>
        <th>Studenti</th>
    </tr>
	<thead>
    <tbody id="vypis-zapisy">
		<tr>
        <td>1</td>
        <td>Matem</td>
        <td>Burian(1), ...</td>
        </tr>
    </tbody>
</table>
