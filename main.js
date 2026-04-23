const API_URL = 'https://rickandmortyapi.com/api/character';

const state = {
    characters: [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || []
};

//FETCH functie
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

//RENDER functie
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

        //DETAIL knop
        clone.querySelector('.detailsBtn')
            .addEventListener('click', () => showDetails(char));

        //FAVORITE knop/toggle
        clone.querySelector('.favBtn')
            .addEventListener('click', () => toggleFavorite(char));
        
        const isFavorite = state.favorites.some(f => f.id === char.id);
        if (isFavorite) {
            clone.querySelector('.card').classList.add('favorited');
        }

        grid.appendChild(clone);
    })
}

//DETAILS functie
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

//FAVORITE functie
function toggleFavorite(char) {
    const exists = state.favorites.find(f => f.id === char.id);

    if (exists) {
        state.favorites = state.favorites.filter(f => f.id !== char.id);
    } else {
        state.favorites.push(char);
    }

    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    renderCards(state.characters);
    renderFavorites();
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    container.innerHTML = "";

    state.favorites.forEach(char => {
        const template = document.getElementById('cardTemplate');
        const clone = template.content.cloneNode(true);

        clone.querySelector('.card-img').src = char.image;
        clone.querySelector('.card-name').textContent = char.name;
        clone.querySelector('.status').textContent = char.status;
        clone.querySelector('.species').textContent = char.species;

        clone.querySelector('.detailsBtn')
            .addEventListener('click', () => showDetails(char));

        clone.querySelector('.favBtn')
            .addEventListener('click', () => toggleFavorite(char));

        container.appendChild(clone);
    });
}

//FILTER, SEARCH, SORT
function applyFilters() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const filterValue = document.getElementById('filterSelect').value;
    const sortValue = document.getElementById('sortSelect').value;

    let result = [...state.characters];

    //SEARCH
    if (searchValue) {
        result = result.filter(c => c.name.toLowerCase().includes(searchValue));
    }

    //FILTER
    if (filterValue) {
        result = result.filter(c => c.status.toLowerCase() === filterValue);
    }

    //SORT
    if (sortValue === 'name-asc') {
        result.sort((a, b ) => a.name.localeCompare(b.name));
    }
    if (sortValue === 'name-desc') {
        result.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderCards(result, 'cardGrid')
}

//EVENTS
document.getElementById('searchInput')
    .addEventListener('input', applyFilters);

document.getElementById('filterSelect')
    .addEventListener('change', applyFilters);

document.getElementById('sortSelect')
    .addEventListener('change', applyFilters);

document.getElementById('themeToggle')
    .addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

//INIT
function init() {
    fetchCharacters();
    renderFavorites();
}

init();