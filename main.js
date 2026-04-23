const API_URL = 'https://rickandmortyapi.com/api/character';

const state = {
    characters: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
};

async function fetchCharacters() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP fout: ${response.status}`);
        } 

        const data = await response.json();
        state.characters = data.results;

        renderCards(state.characters);
    } catch (error) {
        console.error('Fout bij ophalen: ', error);
    }
}

function renderCards(characters) {
    const grid = document.getElementById('cardGrid');
    grid.innerHTML = "";

    characters.forEach(char => {
        const template = document.getElementById('cardTemplate');
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.card-img').src = char.image;
        clone.querySelector('.card-name').textContent = char.name;
        clone.querySelector('.status').textContent = char.status;
        clone.querySelector('.species').textContent = char.species;

        // details knop
        clone.querySelector('.detailsBtn')
            .addEventListener('click', () => showDetails(char));

        // favoriet knop
        clone.querySelector('.favBtn')
            .addEventListener('click', () => toggleFavorite(char));

        grid.appendChild(clone);
    })
}

function showDetails(char) {
    const detail = document.getElementById("detailView");

    detail.innerHTML = `
    <h3>${char.name}</h3>
    <img src="${char.image}" width="150">
    <p>Status: ${char.status}</p>
    <p>Soort: ${char.species}</p>
    <p>Locatie: ${char.location.name}</p>
    `;
}

function toggleFavorite(char) {
    const exists = state.favorites.find(f => f.id === char.id);

    if (exists) {
        state.favorites = state.favorites.filter(f => f.id !== char.id);
    } else {
        state.favorites.push(char);
    }

    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = '';

    state.favorites.forEach(fav => {
        const div = document.createElement('div');
        div.textContent = fav.name;
        container.appendChild(div);
    });
}

document.getElementById('searchInput')
    .addEventListener('input', (e) => {
        const value = e.target.value.toLowerCase();

        const filtered = state.characters.filter(c =>
            c.name.toLowerCase().includes(value)
        );

        renderCards(filtered);
    });

document.getElementById('filterSelect')
    .addEventListener('change', (e) => {
        const value = e.target.value;

        let filtered = state.characters;

        if (value) {
            filtered = state.characters.filter(c => c.status.toLowerCase() === value);
        }

        renderCards(filtered);
    });

document.getElementById('themeToggle')
    .addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

function init() {
    fetchCharacters();
    renderFavorites();
}

init();