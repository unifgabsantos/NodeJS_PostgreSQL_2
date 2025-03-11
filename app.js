require("dotenv").config();

const express = require("express");
const app = express();

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function retrievePokemons() {
    const response = pool.query("SELECT * FROM pokemon");
    return response;
};

async function insertPokemon(pokemon) {
    const response = await pool.query("INSERT INTO pokemon (Nome,Peso,Ataque,Defesa,Velocidade,Habilidade1,Habilidade2) VALUES ($1,$2,$3,$4,$5,$6,$7)", [pokemon.Nome, pokemon.Peso, pokemon.Ataque, pokemon.Defesa, pokemon.Velocidade, pokemon.Habilidade1, pokemon.Habilidade2]);
    return response;
}

function cadastrarPokemon(requests, response) {
    const { nome, peso, ataque, defesa, velocidade, habilidade1, habilidade2 } = requests.body;
    const pokemon = {
        Nome: nome,
        Peso: peso,
        Ataque: ataque,
        Defesa: defesa,
        Velocidade: velocidade,
        Habilidade1: habilidade1,
        Habilidade2: habilidade2
    };
    insertPokemon(pokemon);
    response.send("Pokemon cadastrado com sucesso!");
};

async function mostrarPokemons(requests, response) {
    try {
        const pokemonList = await retrievePokemons();
        const pokemons = pokemonList.rows;
        let listaHTML = "<h2>Pokémons Cadastrados</h2>";
        pokemons.forEach(pokemon => {
            listaHTML += `<h3>${pokemon.nome}</h3>`;
            listaHTML += `<p>Peso: ${pokemon.peso}</p>`;
            listaHTML += `<p>Ataque: ${pokemon.ataque}</p>`;
            listaHTML += `<p>Defesa: ${pokemon.defesa}</p>`;
            listaHTML += `<p>Velocidade: ${pokemon.velocidade}</p>`;
            listaHTML += `<p>Habilidade 1: ${pokemon.habilidade1}</p>`;
            listaHTML += `<p>Habilidade 2: ${pokemon.habilidade2}</p>`;
        })
        response.send(listaHTML); // Respondendo com a lista de pokémons
    } catch (error) {
        console.log(error);
        response.status(500).json({ erro: "Erro ao buscar Pokémons." })
    }
}

app.post("/Pokemon", cadastrarPokemon);

app.get("/Pokemon", mostrarPokemons);

app.listen(80, () => {
    console.log("Servidor rodando na porta 80");
})