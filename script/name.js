const url = "https://pokeapi.co/api/v2/pokemon?limit=100000";  // First API: List of Pokémon
let results = null;

async function getPokemon(url) {
  const response = await fetch(url);
  // Check if the fetch was successful
  if (response.ok) {
    const data = await response.json();  // Parse the JSON response
    doStuff(data);  // Process the data
  }
}

async function fetchPokemonDetails(pokemonUrl) {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
}

async function doStuff(data) {
   results = data;
   console.log('Pokemon data:', results);

   results.results.sort((a, b) => a.name.localeCompare(b.name));  // Sort Pokémon alphabetically

   // Iterate over each Pokémon result
   results.results.forEach(async (pokemon) => {
      const pokemonData = await fetchPokemonDetails(pokemon.url); // Fetch individual Pokémon details

      // Create a div for each Pokémon
      const div = document.createElement('div');
      div.classList.add('pokemon-card');

      // Create and display the Pokémon name
      const name = document.createElement('h2');
      const nameCap = pokemon.name.replace(/\b\w/g, char => char.toUpperCase());  // Capitalize the name
      name.textContent = nameCap;  // Set the capitalized name as the text content
      div.appendChild(name);
       
      // Create and display the Pokémon sprites
      const sprites = pokemonData.sprites;
      const frontDefaultImg = createSpriteImage(sprites.front_default, 'Front Default');
       
      // Only append the image if it exists
      if (frontDefaultImg) {
         div.appendChild(frontDefaultImg);
      }

      // Create and display "View Details" button that links to the detail page
      const button = document.createElement('button');
      button.textContent = 'View Details';
      button.onclick = () => {
         // Navigate to the detail page with Pokémon ID in the URL
         window.location.href = `./card-detail.html?id=${pokemonData.id}`;
      };
      div.appendChild(button);
       
      // Add the div to the main container
      document.querySelector('#pokemonContainer').appendChild(div);
   });
}

function createSpriteImage(src, alt) {
    if (!src) return;  // Return if no sprite is available
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.classList.add('pokemon-sprite');
    img.loading = 'lazy';
    return img;
}

getPokemon(url);  // Start fetching Pokémon data
