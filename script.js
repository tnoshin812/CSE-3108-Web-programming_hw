const searchForm = document.getElementById("searchForm");
const pokemonInput = document.getElementById("pokemonInput");
const clearButton = document.getElementById("clearButton");
const result = document.getElementById("result");
const statusLine = document.getElementById("statusLine");
const quickSearchButtons = document.querySelectorAll(
  ".quick-search button"
);

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatHeight(height) {
  return `${(height / 10).toFixed(1)} m`;
}

function formatWeight(weight) {
  return `${(weight / 10).toFixed(1)} kg`;
}

function formatStatName(name) {
  const names = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed"
  };

  return names[name] || name;
}

function setStatus(message, type = "") {
  statusLine.textContent = message;
  statusLine.className = "status-line";

  if (type) {
    statusLine.classList.add(type);
  }
}

function showLoading() {
  result.innerHTML = `
    <div class="loading-card">
      <div class="loader"></div>
      Loading Pokémon...
    </div>
  `;
}

function showError(message) {
  result.innerHTML = `
    <div class="error-card">
      <h2>Pokémon not found</h2>
      <p>${message}</p>
    </div>
  `;

  setStatus("Unable to load Pokémon.", "error");
}

function renderPokemon(pokemon) {
  const types = pokemon.types
    .map(
      (item) =>
        `<span class="type">${capitalize(item.type.name)}</span>`
    )
    .join("");

  const abilities = pokemon.abilities
    .map(
      (item) =>
        `<span class="ability">${capitalize(
          item.ability.name.replaceAll("-", " ")
        )}</span>`
    )
    .join("");

  const stats = pokemon.stats
    .slice(0, 6)
    .map(
      (item) => `
        <div class="stat">
          <span>${formatStatName(item.stat.name)}</span>
          <strong>${item.base_stat}</strong>
        </div>
      `
    )
    .join("");

  result.innerHTML = `
    <div class="card-content">

      <div class="pokemon-visual">

        <img
          class="pokemon-image"
          src="${
            pokemon.sprites.other["official-artwork"].front_default ||
            pokemon.sprites.front_default
          }"
          alt="${pokemon.name}"
        />

      </div>


      <div class="pokemon-info">

        <div class="pokemon-number">
          #${String(pokemon.id).padStart(3, "0")}
        </div>

        <h2 class="pokemon-name">
          ${pokemon.name}
        </h2>

        <div class="types">
          ${types}
        </div>


        <div class="stats">

          ${stats}

          <div class="stat">
            <span>Height</span>
            <strong>${formatHeight(pokemon.height)}</strong>
          </div>

          <div class="stat">
            <span>Weight</span>
            <strong>${formatWeight(pokemon.weight)}</strong>
          </div>

        </div>


        <div class="abilities-title">
          Abilities
        </div>

        <div class="abilities">
          ${abilities}
        </div>

      </div>

    </div>
  `;

  setStatus(
    `Loaded ${capitalize(pokemon.name)} successfully.`
  );
}

async function fetchPokemon(name) {
  const pokemonName = name.trim().toLowerCase();

  if (!pokemonName) {
    showError("Please enter a Pokémon name.");
    return;
  }

  showLoading();
  setStatus("Fetching Pokémon data...", "loading");

  try {
    const response = await fetch(
      `${API_URL}${encodeURIComponent(pokemonName)}`
    );

    if (!response.ok) {
      throw new Error("Pokémon does not exist.");
    }

    const pokemon = await response.json();

    renderPokemon(pokemon);

    pokemonInput.value = pokemon.name;
    clearButton.style.display = "block";
  } catch (error) {
    showError(
      "Check the spelling and try another Pokémon name."
    );
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  fetchPokemon(pokemonInput.value);
});

pokemonInput.addEventListener("input", () => {
  clearButton.style.display =
    pokemonInput.value.trim() ? "block" : "none";
});

clearButton.addEventListener("click", () => {
  pokemonInput.value = "";
  clearButton.style.display = "none";
  pokemonInput.focus();
});

quickSearchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pokemon = button.dataset.pokemon;

    pokemonInput.value = pokemon;
    clearButton.style.display = "block";

    fetchPokemon(pokemon);
  });
});

fetchPokemon("pikachu");