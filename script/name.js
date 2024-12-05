const url = "https://pokeapi.co/api/v2/pokemon?limit=100000";

async function getPokemon(url) {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    doStuff(data);
  }
}

async function doStuff(data) {
  for (let pokemon of data.results) {
    const div = document.createElement('div');
    div.classList.add('pokemon-card');

    const name = document.createElement('h2');
    const nameCap = pokemon.name.replace(/\b\w/g, char => char.toUpperCase());
    name.textContent = nameCap;
    div.appendChild(name);

    document.querySelector('#pokemonContainer').appendChild(div);
  }
}

getPokemon(url);
