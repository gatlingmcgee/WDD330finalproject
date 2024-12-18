const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
const favoritesContainer = document.querySelector('#favoritesContainer');

// Function to capitalize the name
function capitalizeName(name) {
    return name.replace(/\b\w/g, char => char.toUpperCase());
}

// Function that gets pokemon details
async function getPokemonDetails(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        console.error('Failed to fetch Pokémon details');
        return null;
    }
}

// Function to remove pokemon from favorites page
function removeFromFavorites(pokemonId, favDiv) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.id !== pokemonId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    favDiv.remove();

    if (favorites.length === 0) {
        displayEmptyMessage();
    }
}

// Function to display an empty favorites message
function displayEmptyMessage() {
    const existingMessage = document.querySelector('.empty-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    favoritesContainer.innerHTML = '';

    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your favorites list is empty. Please add some Pokémon!';
    emptyMessage.classList.add('empty-message');
    favoritesContainer.appendChild(emptyMessage);
}

// Displays each favorite pokemon
if (favorites.length === 0) {
    displayEmptyMessage();
} else {
favorites.forEach(async (fav) => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('favorite-card');

    const favName = document.createElement('h2');
    favName.textContent = capitalizeName(fav.name);
    favDiv.appendChild(favName);

    const favSprite = createSpriteImage(fav.sprite, 'Favorite Sprite');
    if (favSprite) {
        favDiv.appendChild(favSprite);
    }

    // Gets details from favorite pokemon
    const pokemonData = await getPokemonDetails(fav.id);
    if (pokemonData) {
        const types = pokemonData.types.map(type => type.type.name).join(', ');
        const typesDiv = document.createElement('p');
        typesDiv.textContent = `Types: ${types}`;
        favDiv.appendChild(typesDiv);

        const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
        const abilitiesDiv = document.createElement('p');
        abilitiesDiv.textContent = `Abilities: ${abilities}`;
        favDiv.appendChild(abilitiesDiv);
    }

    // Creates the remove favorite pokemon button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove from Favorites';
    removeButton.onclick = () => removeFromFavorites(fav.id, favDiv);
    favDiv.appendChild(removeButton);

    favoritesContainer.appendChild(favDiv);
});
}

// Checks to make sure an image is available and utilizes lazy load
function createSpriteImage(src, alt) {
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}
