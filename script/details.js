const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

console.log("Pokemon ID:", pokemonId);

const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

async function getPokemonDetail() {
    const response = await fetch(detailUrl);
    if (response.ok) {
        const data = await response.json();
        displayPokemonDetails(data);
    }
}

// Function creates all pokemon details
function displayPokemonDetails(pokemonData) {
    const container = document.querySelector('#pokemonDetailContainer');
    
    // Creates and displays pokemon names
    const name = document.createElement('h2');
    const nameCap = pokemonData.name.replace(/\b\w/g, char => char.toUpperCase());
    name.textContent = nameCap;
    container.appendChild(name);

    // Creates and display pokemon images
    const sprites = pokemonData.sprites;
    const frontDefaultImg = createSpriteImage(sprites.front_default, 'Front Default');
    if (frontDefaultImg) {
        container.appendChild(frontDefaultImg);
    }

    // Displays pokemon details for the details page
    const types = pokemonData.types.map(type => type.type.name).join(', ');
    const typesDiv = document.createElement('p');
    typesDiv.textContent = `Types: ${types}`;
    container.appendChild(typesDiv);

    const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
    const abilitiesDiv = document.createElement('p');
    abilitiesDiv.textContent = `Abilities: ${abilities}`;
    container.appendChild(abilitiesDiv);

    // Foavorite button to add a pokemon to favorites
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.onclick = () => addToFavorites(pokemonData);
    container.appendChild(favoriteButton);
}

// Function creates pokemon images and utilixes lazy load
function createSpriteImage(src, alt) {
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}

// Function to add pokemon to favorites usong local storage
function addToFavorites(pokemonData) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const favoritePokemon = {
        id: pokemonData.id,
        name: pokemonData.name,
        sprite: pokemonData.sprites.front_default,
    };

    // This checks for pokemon in the favorites already to prevent duplicates
    const isAlreadyFavorite = favorites.some(fav => fav.id === pokemonData.id);
    if (!isAlreadyFavorite) {
        favorites.push(favoritePokemon);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`${pokemonData.name} has been added to your favorites!`);
    } else {
        alert(`${pokemonData.name} already exists in your favorites.`);
    }
}

getPokemonDetail();
