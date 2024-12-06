// Get the Pokémon ID from the URL query parameter
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');  // Extract the "id" from the URL

console.log("Pokemon ID:", pokemonId);

// The URL to fetch detailed information about the Pokémon
const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

async function getPokemonDetail() {
    const response = await fetch(detailUrl);
    // Check if the fetch was successful
    if (response.ok) {
        const data = await response.json();  // Parse the JSON response
        displayPokemonDetails(data);  // Process and display the data
    }
}

function displayPokemonDetails(pokemonData) {
    const container = document.querySelector('#pokemonDetailContainer');
    
    // Create and display the Pokémon name
    const name = document.createElement('h2');
    const nameCap = pokemonData.name.replace(/\b\w/g, char => char.toUpperCase());  // Capitalize the name
    name.textContent = nameCap;
    container.appendChild(name);

    // Create and display Pokémon sprites
    const sprites = pokemonData.sprites;
    const frontDefaultImg = createSpriteImage(sprites.front_default, 'Front Default');
    if (frontDefaultImg) {
        container.appendChild(frontDefaultImg);
    }

    // Display additional Pokémon details like types, abilities, etc.
    const types = pokemonData.types.map(type => type.type.name).join(', ');
    const typesDiv = document.createElement('p');
    typesDiv.textContent = `Types: ${types}`;
    container.appendChild(typesDiv);

    const abilities = pokemonData.abilities.map(ability => ability.ability.name).join(', ');
    const abilitiesDiv = document.createElement('p');
    abilitiesDiv.textContent = `Abilities: ${abilities}`;
    container.appendChild(abilitiesDiv);
}

function createSpriteImage(src, alt) {
    if (!src) return null;  // Return if no sprite is available
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}

getPokemonDetail();  // Start fetching Pokémon details
