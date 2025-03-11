//https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png
const pokemonImageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
const cardColor = document.getElementById("card-color");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const pokemonImage = document.getElementById("pokemon-image");
const pokemonSpecies = document.getElementById("pokemon-species");
const pokemonHeight = document.getElementById("pokemon-height");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonMoves = document.getElementById("pokemon-moves");
const pokemonDescription = document.getElementById("pokemon-description");
const pokemonStatsProgress = document.getElementsByClassName("card-bottom-stats-line-progress");
const pokemonStatsValue = document.getElementsByClassName("card-bottom-stats-value");


function searchPokemon(e) {
    e.preventDefault();
    let pokemonSearch = document.getElementById("pokemon-search").value;

    return getPokemon(pokemonSearch);
}

function getEnglishDescription(apiDescription) {
    for (let entry of apiDescription.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}

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

function getPokemonStats(stats, pokemonColor) {
    //Progress bar's color
    let color = pokemonColor[0].type.name;
    console.log(color);
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
            pokemonImage.src = pokemonImageUrl + data.id + ".svg";

            //Species / Type
            getPokemonSpecies(data.types);

            //Data / Moves    
            pokemonHeight.innerHTML = data.height / 10;
            pokemonWeight.innerHTML = data.weight / 10;
            let moves = data.moves[0].move.name + " <br> " + data.moves[1].move.name;
            pokemonMoves.innerHTML = moves;

            //Stats
            getPokemonStats(data.stats, data.types);
        })
        .catch(error => console.log(error))

}

getPokemon();