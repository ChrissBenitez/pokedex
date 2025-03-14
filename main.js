//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png
const API = "https://pokeapi.co/api/v2/pokemon/";
// const pokemonImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
let pokemonImageUrl;
const pokemonGrid = document.getElementById("pokemon-grid");
let pokemonGridName;
let pokemonImage = document.getElementById("pokemon-image");

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", filterPokemon);

const pokemonSearched = [];
const cardColor = document.getElementById("card-color");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonSpecies = document.getElementById("pokemon-species");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonMoves = document.getElementById("pokemon-moves");
const pokemonDescription = document.getElementById("pokemon-description");
const pokemonStatsProgress = document.getElementsByClassName("card-bottom-stats-line-progress");
const pokemonStatsValue = document.getElementsByClassName("card-bottom-stats-value");


let listLoad = 50;

// Search Pokemon based on the input search
function searchPokemon(e) {
    e.preventDefault();
    let pokemonSearch = document.getElementById("pokemon-search").value;

    return getPokemon(pokemonSearch);
}

// Gets the description in English
function getEnglishDescription(apiDescription) {
    for (let entry of apiDescription.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}

// Get the species of the Pokemon
function getPokemonSpecies(dataSpecies) {
    if (pokemonSpecies.childElementCount > 0) {
        pokemonSpecies.innerHTML = "";
    }
    for (let species of dataSpecies) {
        let speciesDiv = document.createElement("div");
        speciesDiv.classList.add("pokemon-type", species.type.name);
        speciesDiv.innerHTML = species.type.name.charAt(0).toUpperCase() + species.type.name.slice(1);
        pokemonSpecies.appendChild(speciesDiv);
    }
    //Set background color based on the type
    // Get last class
    let lastClass = cardColor.className.split(' ')[cardColor.className.split(' ').length - 1];
    //Replaces  last class by new class (type)
    if (cardColor.className.split(' ').length > 1) {
        cardColor.classList.remove(lastClass);
    }
    cardColor.classList.add(dataSpecies[0].type.name)

}

// Get the stats of the Pokemon
function getPokemonStats(stats, pokemonColor) {
    //Progress bar's color
    let color = pokemonColor[0].type.name;
    // console.log(color);
    for (let i = 0; i < pokemonStatsValue.length; i++) {
        pokemonStatsValue[i].innerHTML = stats[i].base_stat;

        //Set max value to 100, for the progress bar
        if (stats[i].base_stat > 100) {
            stats[i].base_stat = 100;
        }
        pokemonStatsProgress[i].style.width = stats[i].base_stat + "%";


        let lastClass = pokemonStatsProgress[i].className.split(' ')[pokemonStatsProgress[i].className.split(' ').length - 1];
        //Replaces  last class by new class (type)
        if (pokemonStatsProgress[i].className.split(' ').length > 1) {
            pokemonStatsProgress[i].classList.remove(lastClass);
        }

        //Set background color based on the type
        pokemonStatsProgress[i].classList.add(color);
    }
}

// Get the Pokemon data - Main function
function getPokemon(pokemon) {
    let apiDescription = "https://pokeapi.co/api/v2/pokemon-species/" + pokemon;
    let apiPokemon = "https://pokeapi.co/api/v2/pokemon/" + pokemon;
    //fetch(apiPokemon)
    fetch(apiDescription).then((res) =>
        res.json()
    )
        .then(data => {
            pokemonDescription.innerHTML = getEnglishDescription(data);
        })

    fetch(apiPokemon)
        .then(res => {
            if (!res.ok) {
                console.log("fail");
            }
            return res.json();
        })
        .then(data => {

            //Name / ID / Image
            pokemonName.innerHTML = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonId.innerHTML = "#" + data.id;
            // pokemonImage.src = pokemonImageUrl + data.id + ".svg";
            pokemonImage.src = pokemonImageUrl;

            //Species / Type
            getPokemonSpecies(data.types);

            //Data / Moves
            pokemonHeight.innerHTML = data.height / 10;
            pokemonWeight.innerHTML = data.weight / 10;
            let moves = data.moves[0].move.name + " <br> " + data.moves[1].move.name;
            pokemonMoves.innerHTML = moves;

            //Stats
            getPokemonStats(data.stats, data.types);
            cardColor.style.display = "block";
        })
        .catch(error => console.log(error))
}

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


// (async () => {
//     console.log('fetching data...');
//     const pokemon = await fetchData(`${API}?limit=3`);
//     try {
//         console.log(pokemon.results);


//         pokemon.results.forEach(element => {
//             console.log(element.url);
//             let x = fetchData(element.url);
//             console.log(x);
//         });

//         let template = `
//             ${pokemon.results.map(pokemon => `
//                 <div class="pokemon-grid-item">
//                     <div class="pokemon-grid-id">${pokemon.name}</div>

//                     <div class="pokemon-grid-name">${pokemon.name}</div>
//                 </div>
//             `).join('')
//             }
//         `;
//         pokemonGrid.innerHTML += template;
//     } catch (error) {
//         console.error(error);
//     }
// })();




// fetchData(`${API}?limit=3`)
//     // fetchData(`${API}?limit=3`)
//     // Transforms response on json
//     //.then(response => response.json())
//     // We do another request for just 1 produtct
//     .then(pokemons => {
//         console.log(pokemons);
//         pokemonGridName = pokemons.results[0].name;
//         return fetchData(pokemons.results[0].url);
//     })
//     // Transforms response on json
//     //.then(response => response.json())
//     .then(pokemon => {
//         console.log(pokemon.id)
//         console.log(pokemon.sprites.other.dream_world.front_default)
//         console.log(pokemon);


//         let template = `
//             <div class="pokemon-grid-item">
//                 <div class="pokemon-grid-id">${pokemon.id}</div>
//                 <div class="pokemon-grid-image">
//                 <img class="pokedex-image" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}"></div>
//                 <div class="pokemon-grid-name">${pokemonGridName}</div>
//             </div>
//         `;
//         pokemonGrid.innerHTML += template;
//     })
//     .catch(error => console.log(error))
//     .finally(() => console.log("finished"))

async function loadPokedex() {
    for (let i = 1; i <= listLoad; i++) {
        await fetchData(`${API}${i}`)
            .then(pokemon => {
                pokemonSearched.push(pokemon);

                // console.log(pokemon.id)
                // console.log(pokemon.sprites.other.dream_world.front_default)
                // console.log(pokemon.name);

                let template = `
                        <div class="pokemon-grid-item">
                            <div class="pokemon-grid-id">${pokemon.id}</div>
                            <div class="pokemon-grid-image">
                            <img class="pokedex-image" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}"></div>
                            <div class="pokemon-grid-name">${pokemon.name}</div>
                        </div>
                    `;
                pokemonGrid.innerHTML += template;
            })

            .then(() => {
                showPokemon = document.getElementsByClassName("pokemon-grid-item");
                addEvents();
            }
            )
            .catch(error => console.log(error))
            .finally(() => console.log("finished"))


    };
    console.log(pokemonSearched);
}


let showPokemon;


function addEvents() {
    for (let i = 0; i < showPokemon.length; i++) {
        showPokemon[i].addEventListener("click", function (e) {
            pokemonImageUrl = e.currentTarget.children[1].children[0].src;
            getPokemon(showPokemon[i].children[2].innerHTML);
        });
    }
    let goBack = document.getElementById("go-back");
    goBack.addEventListener("click", function () {
        cardColor.style.display = "none";
    }
    );
}

loadPokedex();



// Filters Pokemons based on the input search
function filterPokemon(e) {
    const term = e.target.value.toUpperCase();
    const pokemons = pokemonGrid.getElementsByClassName("pokemon-grid-item");
    Array.from(pokemons).forEach((pokemon) => {
        const title = pokemon.lastElementChild.innerHTML;
        if (title.toUpperCase().indexOf(term) > -1) {
            pokemon.style.display = "flex";
        } else {
            pokemon.style.display = "none";
        }
    });
}   
