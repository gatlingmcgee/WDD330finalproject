const url = "https://pokeapi.co/api/v2/pokemon?limit=100000";
let results = null;

async function getPokemon(url) {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    doStuff(data);
  }
}

// Function to get pokemon details
async function fetchPokemonDetails(pokemonUrl) {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
}

async function doStuff(data) {
   results = data;
   console.log('Pokemon data:', results);

   results.results.sort((a, b) => a.name.localeCompare(b.name));

   // Displays all pokemon at page load
   displayPokemonList(results.results);
}

// Function to display pokemon list
function displayPokemonList(pokemonList) {
   const container = document.querySelector('#pokemonContainer');
   container.innerHTML = '';  // Clear the container before displaying new results

   pokemonList.forEach(async (pokemon) => {
      const pokemonData = await fetchPokemonDetails(pokemon.url);

      // Creates the div for each pokemon
      const div = document.createElement('div');
      div.classList.add('pokemon-card');

      // Creates and displays pokemon names
      const name = document.createElement('h2');
      const nameCap = pokemon.name.replace(/\b\w/g, char => char.toUpperCase());
      name.textContent = nameCap;
      div.appendChild(name);

      // Creates and display pokemon images
      const sprites = pokemonData.sprites;
      const frontDefaultImg = createSpriteImage(sprites.front_default, 'Front Default');
      
      if (frontDefaultImg) {
         div.appendChild(frontDefaultImg);
      }

      // Creates the details view button
      const button = document.createElement('button');
      button.textContent = 'View Details';
      button.onclick = () => {
         window.location.href = `./card-detail.html?id=${pokemonData.id}`;
      };
      div.appendChild(button);
      container.appendChild(div);
   });
}

// Function to create sprite images
function createSpriteImage(src, alt) {
    if (!src) return null;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}

// Function to serach for pokemon in a search bar
function searchPokemon() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredResults = results.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );

    displayPokemonList(filteredResults);
}

// Event listener for the search button
const searchButton = document.getElementById('searchButton');
if (searchButton) {
    searchButton.addEventListener('click', searchPokemon);
}

getPokemon(url);
