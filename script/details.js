const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');

console.log("Pokemon ID:", pokemonId);

const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

async function getPokemonDetail() {
    if (!pokemonId) {
        return;
    }

    const detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

    const response = await fetch(detailUrl);
    if (response.ok) {
        const data = await response.json();
        displayPokemonDetails(data);
    } else {
        console.error('Failed to fetch Pokémon details');
    }
}

async function fetchMoveDetails(moveUrl) {
    const response = await fetch(moveUrl);
    if (response.ok) {
        const moveData = await response.json();
        return moveData;
    } else {
        console.error('Failed to fetch move details');
        return null;
    }
}

async function getLegacyPokemonCry(pokemonId) {
    const cryUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    const response = await fetch(cryUrl);
    if (response.ok) {
        const data = await response.json();
        const cry = data.cries;
        return cry.legacy;
    } else {
        console.error('Failed to fetch Pokémon cry');
        return null;
    }
}

async function getLatestPokemonCry(pokemonId) {
    const cryUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    const response = await fetch(cryUrl);
    if (response.ok) {
        const data = await response.json();
        const cry = data.cries;
        return cry.latest;
    } else {
        console.error('Failed to fetch Pokémon cry');
        return null;
    }
}


async function displayPokemonDetails(pokemonData) {
    const container = document.querySelector('#pokemonDetailContainer');


    const pokedexButton = document.createElement('button');
    pokedexButton.textContent = 'View Pokédex Entry';
    pokedexButton.classList.add('button');
    

    const nameParts = pokemonData.name.split('-');
    let normalizedName = nameParts[0];
    if (nameParts[1] === 'mega' || nameParts[1] === 'primal') {
        normalizedName += `/${nameParts[1]}`;
        if (nameParts[2]) {
            normalizedName += `-${nameParts[2]}`;
        }
    }
    pokedexButton.onclick = () => {
        window.open(`https://pokemondb.net/pokedex/${normalizedName}`, '_blank');
    };
    
    container.appendChild(pokedexButton);

    // Foavorite button to add a pokemon to favorites
    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.classList.add('button');
    favoriteButton.onclick = () => addToFavorites(pokemonData);
    container.appendChild(favoriteButton);
    
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

    // Creates and display the back sprite
    const backDefaultImg = createSpriteImage(sprites.back_default, 'Back Default');
    if (backDefaultImg) {
        container.appendChild(backDefaultImg);
    }
    
    // Creates and display the shiny front sprite
    const shinyFrontImg = createSpriteImage(sprites.front_shiny, 'Shiny Front');
    if (shinyFrontImg) {
        container.appendChild(shinyFrontImg);
    }
    
    // Creates and display the shiny back sprite
    const shinyBackImg = createSpriteImage(sprites.back_shiny, 'Shiny Back');
    if (shinyBackImg) {
        container.appendChild(shinyBackImg);
    }

    // Displays pokemon details for the details page
    const types = pokemonData.types.map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)).join(', ');
    const typesDiv = document.createElement('div');
    typesDiv.classList.add('typetextarea');
    const typesP = document.createElement('h4');
    typesP.textContent = `Types: ${types}`;
    container.appendChild(typesDiv);
    typesDiv.appendChild(typesP);

    // Fetch and display abilities
    const abilities = pokemonData.abilities;
    const abilityPromises = abilities.map(async ability => {
        const abilityDetails = await fetchAbilityDetails(ability.ability.url);
        const capitalizedAbilityName = ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1);
        const abilityDiv = document.createElement('p');
        abilityDiv.innerHTML = `Ability: ${capitalizedAbilityName}<br>Effect: ${abilityDetails.effect}`;
        typesDiv.appendChild(abilityDiv);
    });

    // Allows dom to wait for all abilities to be displayed
    await Promise.all(abilityPromises);

    // Display moves with details
    const movesDiv = document.createElement('div');
    movesDiv.classList.add('pokemon-moves');
    const movesTitle = document.createElement('h3');
    movesTitle.textContent = 'Moves:';
    movesDiv.appendChild(movesTitle);

    for (const move of pokemonData.moves.slice(0, 10)) {
        const moveData = await fetchMoveDetails(move.move.url);
        if (moveData) {
            const moveDiv = document.createElement('div');
            moveDiv.classList.add('pokemon-move');
            
            const moveName = document.createElement('h4');
            moveName.textContent = move.move.name.replace(/\b\w/g, char => char.toUpperCase());
            moveDiv.appendChild(moveName);

            const moveType = moveData.type.name;
            const moveTypeElement = document.createElement('p');
            moveTypeElement.textContent = `Type: ${moveType}`;
            moveDiv.appendChild(moveTypeElement);

            const movePower = moveData.power || 'N/A';
            const movePowerElement = document.createElement('p');
            movePowerElement.textContent = `Power: ${movePower}`;
            moveDiv.appendChild(movePowerElement);

            const moveAccuracy = moveData.accuracy || 'N/A';
            const moveAccuracyElement = document.createElement('p');
            moveAccuracyElement.textContent = `Accuracy: ${moveAccuracy}`;
            moveDiv.appendChild(moveAccuracyElement);

            const moveDescription = moveData.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'No description available';
            const moveDescriptionElement = document.createElement('p');
            moveDescriptionElement.textContent = `Description: ${moveDescription}`;
            moveDiv.appendChild(moveDescriptionElement);

            movesDiv.appendChild(moveDiv);
        }
    }

        const cryButtonLegacy = document.createElement('button');
        cryButtonLegacy.textContent = 'Hear Old Pokémon Cry';
        cryButtonLegacy.classList.add('button');
        cryButtonLegacy.onclick = async () => {
            const cryUrl = await getLegacyPokemonCry(pokemonData.id);
            if (cryUrl) {
                const audio = new Audio(cryUrl);
                audio.play();
            } else {
                alert('Sorry, the Pokémon cry is not available.');
            }
        };
    
        container.appendChild(cryButtonLegacy);

        const cryButtonLatest = document.createElement('button');
        cryButtonLatest.textContent = 'Hear New Pokémon Cry';
        cryButtonLatest.classList.add('button');
        cryButtonLatest.onclick = async () => {
            const cryUrl = await getLatestPokemonCry(pokemonData.id);
            if (cryUrl) {
                const audio = new Audio(cryUrl);
                audio.play();
            } else {
                alert('Sorry, the Pokémon cry is not available.');
            }
        };
    
        container.appendChild(cryButtonLatest);


    container.appendChild(movesDiv);


}

// Function to get more detailed ability info
async function fetchAbilityDetails(abilityUrl) {
    const response = await fetch(abilityUrl);
    if (response.ok) {
        const abilityData = await response.json();
        return {
            effect: abilityData.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'No description available',
        };
    } else {
        console.error('Failed to fetch ability details');
        return { effect: 'No description available' };
    }
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
