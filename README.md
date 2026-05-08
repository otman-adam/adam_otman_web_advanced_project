# Rick & Morty API Explorer

Een interactieve single-page webapplicatie voor het vak Advanced Web.
De app gebruikt echte API-data om personages te verkennen, te filteren, te sorteren en te bewaren als favorieten.

## Functionaliteit
- Data ophalen van de Rick & Morty API
- Volledige lijstweergave met 8 kolommen in een tabel
- Visuele kaartweergave van personages
- Detailweergave per personage
- Search op naam
- Filter op status (Alive/Dead)
- Sorteren op naam (A-Z / Z-A)
- Favorieten opslaan in LocalStorage
- Themawisselaar (licht/donker) met opslag in LocalStorage
- Gecachte API-data in LocalStorage
- Persoonlijke notities met formulier validatie
- Responsive ontwerp voor mobiel en desktop
- IntersectionObserver voor animatie bij scrollen

## Gebruikte API
- API: https://rickandmortyapi.com
- Endpoint: https://rickandmortyapi.com/api/character

## Technische implementatie
### JavaScript concepten
- DOM selectie: `getElementById`, `querySelector`, `querySelectorAll` (main.js lines 13-16, 94, 129, 160, 189)
- DOM manipulatie: `innerHTML`, `appendChild`, `classList` (main.js lines 83, 94-127, 159-172, 188-218, 224-260)
- Events: `addEventListener` op input, select, buttons, form submit (main.js lines 298-312)
- Constantes: `const API_URL`, `const state`, etc. (main.js lines 1-16)
- Template literals: HTML strings in backticks (main.js lines 83, 160, 189, 251)
- Iteratie over arrays: `.forEach()` (main.js lines 94, 129, 188, 224)
- Array methodes: `.filter()`, `.sort()`, `.some()` (main.js lines 174-176, 224, 272-282)
- Arrow functions: `() => {}` (main.js lines 18, 99, 104, 112, 128, 200, 220, 298, 303, 309, 312)
- Ternary operator: `theme === 'dark' ? '☀️' : '🌙'` (main.js line 31)
- Callback functies: event handlers, observer callbacks (main.js lines 18, 99-104, 112, 200, 220, 298-312)
- Promises: `fetch()` retourneert een Promise (main.js line 63)
- Async / Await: `async function fetchCharacters()` (main.js line 63)
- Observer API: `IntersectionObserver` voor kaartanimaties (main.js line 18)

### Data & opslag
- Fetch: `fetch(API_URL)` (main.js line 63)
- JSON: `response.json()` (main.js line 69)
- LocalStorage: favorieten, thema, notities, gecachte API-data (main.js lines 3-5, 63-72, 174-181, 224-231, 247-253)

### Styling & layout
- Grid layout voor kaarten
- Tabelweergave met kolommen
- CSS voor responsiviteit
- Gebruiksvriendelijke knoppen, formulier en tabel

### Tooling
- Vite project met `package.json`
- Scheiding van HTML, CSS en JS
- `src/` map voor bronbestanden

## Projectstructuur
- `index.html`
- `package.json`
- `.gitignore`
- `README.md`
- `src/main.js`
- `src/style.css`

## Bronnen
- https://rickandmortyapi.com
- Vite: https://vitejs.dev/guide/ 
- https://chatgpt.com (zie chatgptchat.txt)


