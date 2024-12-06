// Get the favorites from localStorage
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const favoritesContainer = document.querySelector('#favoritesContainer');

// Function to fetch detailed information about a Pokémon using its ID
async function getPokemonDetails(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
    if (response.ok) {
        const data = await response.json();
        return data; // Return the detailed Pokémon data
    } else {
        console.error('Failed to fetch Pokémon details');
        return null;
    }
}

// Display each favorite Pokémon
favorites.forEach(async (fav) => {
    const favDiv = document.createElement('div');
    favDiv.classList.add('favorite-card');

    const favName = document.createElement('h2');
    favName.textContent = fav.name;
    favDiv.appendChild(favName);

    // Create the Pokémon sprite image
    const favSprite = createSpriteImage(fav.sprite, 'Favorite Sprite');
    if (favSprite) {
        favDiv.appendChild(favSprite);
    }

    // Fetch detailed information about the favorite Pokémon
    const pokemonData = await getPokemonDetails(fav.id);
    if (pokemonData) {
        // Display additional details (like types, abilities, etc.)
        const types = pokemonData.types.map(type => type.type.name).join(', ');
        const typesDiv = document.createElement('p');
        typesDiv.textContent = `Types: ${types}`;
        favDiv.appendChild(typesDiv);

        const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
        const abilitiesDiv = document.createElement('p');
        abilitiesDiv.textContent = `Abilities: ${abilities}`;
        favDiv.appendChild(abilitiesDiv);
    }

    // Append the favorite Pokémon to the container
    favoritesContainer.appendChild(favDiv);
});

// Helper function to create and display the Pokémon sprite image
function createSpriteImage(src, alt) {
    if (!src) return null;  // Return null if no sprite is available
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}
