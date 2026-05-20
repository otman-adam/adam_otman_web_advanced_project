
// CONFIGURATIE & STATE
// API endpoint voor Rick and Morty karakters
const API_URL = 'https://rickandmortyapi.com/api/character';

// LocalStorage sleutels voor persistente opslag
const CACHE_KEY = 'rm_characters_cache';
const FAVORITES_KEY = 'rm_favorites';
const NOTES_KEY = 'rm_notes';
const THEME_KEY = 'rm_theme';

// Centraal state object voor applicatie data
const state = {
    characters: [],
    favorites: JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [],
    notes: JSON.parse(localStorage.getItem(NOTES_KEY)) || []
};

// DOM-elementen ophalen (selectie)
const themeToggle = document.getElementById('themeToggle');
const noteForm = document.getElementById('noteForm');
const noteInput = document.getElementById('noteInput');
const noteList = document.getElementById('noteList');

// OBSERVER API - Animaties bij scrollen
// IntersectionObserver voor lazy loading van kaarten
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

// THEMA FUNCTIONALITEIT
// Pas thema toe en sla op in LocalStorage
function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
}

// Initialiseer thema bij pagina load
function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);
}

// CACHE FUNCTIONALITEIT
// Haal gecachte karakters op uit LocalStorage (1 uur geldig)
function getCachedCharacters() {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    try {
        const payload = JSON.parse(cached);
        // Check of cache nog geldig is (< 1 uur oud)
        if (Date.now() - payload.time < 1000 * 60 * 60) {
            return payload.characters;
        }
    } catch (error) {
        console.warn('Cache niet geldig', error);
    }

    return null;
}

// Sla karakters op in cache met timestamp
function setCachedCharacters(characters) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
        time: Date.now(),
        characters
    }));
}

// FETCH & API FUNCTIONALITEIT
// Fetch characteristieke data van API (async/await)
async function fetchCharacters() {
    // Haal eerst cached data op (Promise)
    const cached = getCachedCharacters();
    if (cached) {
        state.characters = cached;
        renderCharacters(cached);
    }

    try {
        // Fetch gegevens van Rick and Morty API
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP fout: ${response.status}`);
        }

        // Parse JSON response
        const data = await response.json();
        state.characters = data.results;
        setCachedCharacters(state.characters);
        renderCharacters(state.characters);
    } catch (error) {
        console.error('Fout bij ophalen: ', error);
        if (!cached) {
            const detail = document.getElementById('detailView');
            detail.innerHTML = '<p>Fout bij ophalen. Probeer later opnieuw.</p>';
        }
    }
}

// RENDER FUNCTIES - DOM Manipulatie
// Render beide kaarten en tabel weergaven
function renderCharacters(characters) {
    renderCards(characters);
    renderTable(characters);
}

// Render karakters als kaarten in grid (forEach iteration)
function renderCards(characters) {
    const grid = document.getElementById('cardGrid');
    grid.innerHTML = '';

    // Iteratie over karakters array met .forEach() (Arrow function)
    characters.forEach(char => {
        // Template cloning: DOM manipulatie
        const template = document.getElementById('cardTemplate');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.card-img').src = char.image;
        clone.querySelector('.card-img').alt = char.name;
        clone.querySelector('.card-name').textContent = char.name;
        clone.querySelector('.status').textContent = `Status: ${char.status}`;
        clone.querySelector('.species').textContent = `Soort: ${char.species}`;
        clone.querySelector('.location').textContent = `Locatie: ${char.location.name}`;
        clone.querySelector('.origin').textContent = `Origin: ${char.origin.name}`;
        clone.querySelector('.episodes').textContent = `Episodes: ${char.episode.length}`;

        clone.querySelector('.detailsBtn')
            .addEventListener('click', () => showDetails(char));

        clone.querySelector('.favBtn')
            .addEventListener('click', () => toggleFavorite(char));

        const isFavorite = state.favorites.some(f => f.id === char.id);
        const card = clone.querySelector('.card');
        if (isFavorite) {
            card.classList.add('favorited');
        }

        grid.appendChild(clone);
    });

    document.querySelectorAll('.card').forEach(card => cardObserver.observe(card));
}

function renderTable(characters) {
    const tbody = document.querySelector('#characterTable tbody');
    tbody.innerHTML = '';

    characters.forEach(char => {
        const row = document.createElement('tr');
        const isFavorite = state.favorites.some(f => f.id === char.id);

        row.innerHTML = `
            <td>${char.name}</td>
            <td>${char.status}</td>
            <td>${char.species}</td>
            <td>${char.gender}</td>
            <td>${char.origin.name}</td>
            <td>${char.location.name}</td>
            <td>${char.episode.length}</td>
            <td><button class="tableFavBtn">${isFavorite ? '✔️' : '⭐'}</button></td>
        `;

        row.querySelector('.tableFavBtn')
            .addEventListener('click', (event) => {
                event.stopPropagation();
                toggleFavorite(char);
            });

        row.addEventListener('click', () => showDetails(char));
        tbody.appendChild(row);
    });
}

function showDetails(char) {
    const detail = document.getElementById('detailView');

    detail.innerHTML = `
        <h3>${char.name}</h3>
        <img src="${char.image}" alt="${char.name}" width="150">
        <p>Status: ${char.status}</p>
        <p>Soort: ${char.species}</p>
        <p>Geslacht: ${char.gender}</p>
        <p>Origin: ${char.origin.name}</p>
        <p>Locatie: ${char.location.name}</p>
        <p>Aantal episodes: ${char.episode.length}</p>
    `;
}

function toggleFavorite(char) {
    const exists = state.favorites.find(f => f.id === char.id);

    if (exists) {
        state.favorites = state.favorites.filter(f => f.id !== char.id);
    } else {
        state.favorites.push(char);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(state.favorites));
    renderCharacters(state.characters);
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';

    if (state.favorites.length === 0) {
        container.innerHTML = '<p>Geen favorieten opgeslagen.</p>';
        return;
    }

    state.favorites.forEach(char => {
        const template = document.getElementById('cardTemplate');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.card-img').src = char.image;
        clone.querySelector('.card-img').alt = char.name;
        clone.querySelector('.card-name').textContent = char.name;
        clone.querySelector('.status').textContent = `Status: ${char.status}`;
        clone.querySelector('.species').textContent = `Soort: ${char.species}`;
        clone.querySelector('.location').textContent = `Locatie: ${char.location.name}`;
        clone.querySelector('.origin').textContent = `Origin: ${char.origin.name}`;
        clone.querySelector('.episodes').textContent = `Episodes: ${char.episode.length}`;

        clone.querySelector('.detailsBtn')
            .addEventListener('click', () => showDetails(char));

        clone.querySelector('.favBtn')
            .textContent = 'Verwijder';

        clone.querySelector('.favBtn')
            .addEventListener('click', () => toggleFavorite(char));

        clone.querySelector('.card').classList.add('favorited');
        // Make favorite cards visible immediately (they are not observed by IntersectionObserver)
        clone.querySelector('.card').classList.add('visible');
        container.appendChild(clone);
    });
}

function renderNotes() {
    noteList.innerHTML = '';

    if (state.notes.length === 0) {
        noteList.innerHTML = '<p>Geen notities toegevoegd.</p>';
        return;
    }

    state.notes.forEach(note => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.innerHTML = `
            <span>${note.text}</span>
            <button class="removeNoteBtn">✖</button>
        `;

        noteItem.querySelector('.removeNoteBtn')
            .addEventListener('click', () => removeNote(note.id));

        noteList.appendChild(noteItem);
    });
}

// NOTITIES FUNCTIONALITEIT
// Voeg notitie toe met formuliervalidatie
function addNote() {
    const noteText = noteInput.value.trim();
    // Validatie: minimaal 3 tekens
    if (noteText.length < 3) {
        noteInput.setCustomValidity('Minimaal 3 tekens');
        noteInput.reportValidity();
        return;
    }

    // Voeg notitie toe aan state (id = timestamp)
    state.notes.push({
        id: Date.now(),
        text: noteText
    });

    // Clear input en sla op in LocalStorage
    noteInput.value = '';
    noteInput.setCustomValidity('');
    localStorage.setItem(NOTES_KEY, JSON.stringify(state.notes));
    renderNotes();
}

// Verwijder notitie op basis van id (Array filter methode)
function removeNote(id) {
    state.notes = state.notes.filter(note => note.id !== id);
    localStorage.setItem(NOTES_KEY, JSON.stringify(state.notes));
    renderNotes();
}

// FILTER, SEARCH & SORT FUNCTIONALITEIT
// Pas alle filters en sortering toe (Array methods)
function applyFilters() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;
    const sortValue = document.getElementById('sortSelect').value;

    let result = [...state.characters];

    // Search filter met .filter() array methode
    if (searchValue) {
        result = result.filter(c => c.name.toLowerCase().includes(searchValue));
    }

    // Status filter
    if (filterValue) {
        result = result.filter(c => c.status.toLowerCase() === filterValue);
    }

    // Sorteren op naam (Sort methode met callback)
    if (sortValue === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortValue === 'name-desc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderCharacters(result);
}

// EVENT LISTENERS - Interactiviteit
// Notitie formulier submit event
noteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addNote();
});

// Search input event (Real-time filtering)
document.getElementById('searchInput')
    .addEventListener('input', applyFilters);

// Filter select change event
document.getElementById('filterSelect')
    .addEventListener('change', applyFilters);

// Sort select change event
document.getElementById('sortSelect')
    .addEventListener('change', applyFilters);

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(nextTheme);
});

function init() {
    initTheme();
    renderNotes();
    fetchCharacters();
    renderFavorites();
}

init();