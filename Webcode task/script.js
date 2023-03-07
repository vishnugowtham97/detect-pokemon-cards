const pokemonapi = "https://pokeapi.co/api/v2/";

const pageSize = 10;

async function loadPokemonCards(pageNumber) {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = pageNumber * pageSize;
  const pokemonList = await getPokemonList(startIndex, endIndex);

  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = ""; // clear the previous cards

  for (const pokemon of pokemonList.results) {
    const pokemonCard = await createPokemonCard(pokemon.name);
    cardContainer.appendChild(pokemonCard);
  }

  const paginationContainer = document.getElementById("pagination-container");
  paginationContainer.innerHTML = ""; // clear the previous pagination

  const totalPages = Math.ceil(pokemonList.count / pageSize);
  if (totalPages > 1) {
    for (let i = 1; i <= 5; i++) {
      const paginationButton = document.createElement("button");
      paginationButton.innerText = i;
      if (i === pageNumber) {
        paginationButton.classList.add("active");
      } else {
        paginationButton.addEventListener("click", () => {
          loadPokemonCards(i);
        });
      }
      paginationContainer.appendChild(paginationButton);
    }
  }
}

async function createPokemonCard(pokemonName) {
  const pokemonData = await getPokemonData(pokemonName);

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const image = document.createElement("img");
  image.src = pokemonData.sprites.front_default;
  cardDiv.appendChild(image);

  const name = document.createElement("h2");
  name.innerText = pokemonData.name;
  cardDiv.appendChild(name);

  const abilitys = document.createElement('h5');
    abilitys.innerText = `Ability:`;
    cardDiv.appendChild(abilitys)

  const abilities = document.createElement("ul");
  abilities.classList.add("abilities");
  for (let i = 0; i < 3 && i < pokemonData.abilities.length; i++) {
    const ability = document.createElement("li");
    ability.innerText = pokemonData.abilities[i].ability.name;
    abilities.appendChild(ability);
  }
  cardDiv.appendChild(abilities);

  const movess = document.createElement('h5');
    movess.innerText = `Moves:`;
    cardDiv.appendChild(movess);

  const moves = document.createElement("ul");
  moves.classList.add("moves");
  for (let i = 0; i < 3 && i < pokemonData.moves.length; i++) {
    const move = document.createElement("li");
    move.innerText = pokemonData.moves[i].move.name;
    moves.appendChild(move);
  }
  cardDiv.appendChild(moves);

  const weight = document.createElement("p");
  weight.innerText = `Weight: ${pokemonData.weight / 10} kg`;
  cardDiv.appendChild(weight);

  return cardDiv;
}

async function getPokemonList(startIndex, endIndex) {
  const response = await fetch(
    `${pokemonapi}pokemon?limit=${pageSize}&offset=${startIndex}`
  );
  const data = await response.json();
  return data;
}

async function getPokemonData(pokemonName) {
  const response = await fetch(`${pokemonapi}pokemon/${pokemonName}`);
  const data = await response.json();
  return data;
}

loadPokemonCards(1);
