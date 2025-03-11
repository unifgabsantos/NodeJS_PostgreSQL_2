function getPokemonInfo() {
    const pokemon = document.getElementById('nome').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("Pokémon não encontrado!");
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("peso").value = data.weight;
            document.getElementById("ataque").value = data.stats.find(stat => stat.stat.name === 'attack').base_stat;
            document.getElementById("defesa").value = data.stats.find(stat => stat.stat.name === 'defense').base_stat;
            document.getElementById("velocidade").value = data.stats.find(stat => stat.stat.name === 'speed').base_stat;

            document.getElementById("habilidade1").value = data.abilities[0]?.ability.name || "Nenhuma";
            document.getElementById("habilidade2").value = data.abilities[1]?.ability.name || "Nenhuma";
        })
        .catch(error => {
            alert(error.message);
            limparCampos();
        });
}



function limparCampos() {
    document.getElementById("peso").value = "";
    document.getElementById("ataque").value = "";
    document.getElementById("defesa").value = "";
    document.getElementById("velocidade").value = "";
    document.getElementById("habilidade1").value = "";
    document.getElementById("habilidade2").value = "";
}
