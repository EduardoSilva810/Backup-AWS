// =============================
// STATUS DO JOGADOR
// =============================

let jogador = {
    vida: 100,
    vidaMaxima: 100,

    mana: 50,
    manaMaxima: 50,

    nivel: 1
};


// =============================
// STATUS DO INIMIGO
// =============================

let inimigo = {
    nome: "Goblin",

    vida: 80,
    vidaMaxima: 80
};


// =============================
// ATAQUE NORMAL
// =============================

function atacar() {

    if (jogador.vida <= 0 || inimigo.vida <= 0) {
        return;
    }

    const dano = numeroAleatorio(10, 20);

    inimigo.vida -= dano;

    adicionarLog(
        `⚔️ Você atacou o Goblin e causou ${dano} de dano!`
    );

    atualizarTela();

    verificarFim();

    if (inimigo.vida > 0) {
        turnoInimigo();
    }
}


// =============================
// BOLA DE FOGO
// =============================

function bolaDeFogo() {

    if (jogador.mana < 10) {

        adicionarLog("❌ Você não tem mana suficiente!");

        return;
    }

    if (jogador.vida <= 0 || inimigo.vida <= 0) {
        return;
    }

    jogador.mana -= 10;

    const dano = numeroAleatorio(20, 35);

    inimigo.vida -= dano;

    adicionarLog(
        `🔥 Você lançou Bola de Fogo e causou ${dano} de dano!`
    );

    atualizarTela();

    verificarFim();

    if (inimigo.vida > 0) {
        turnoInimigo();
    }
}


// =============================
// CURA
// =============================

function curar() {

    if (jogador.mana < 15) {

        adicionarLog("❌ Mana insuficiente para curar!");

        return;
    }

    if (jogador.vida <= 0 || inimigo.vida <= 0) {
        return;
    }

    jogador.mana -= 15;

    const cura = numeroAleatorio(15, 30);

    jogador.vida += cura;

    if (jogador.vida > jogador.vidaMaxima) {
        jogador.vida = jogador.vidaMaxima;
    }

    adicionarLog(
        `💚 Você recuperou ${cura} de vida!`
    );

    atualizarTela();

    turnoInimigo();
}


// =============================
// DEFENDER
// =============================

function defender() {

    if (jogador.vida <= 0 || inimigo.vida <= 0) {
        return;
    }

    adicionarLog(
        "🛡️ Você se preparou para defender o próximo ataque!"
    );

    turnoInimigo(true);
}


// =============================
// TURNO DO INIMIGO
// =============================

function turnoInimigo(defendendo = false) {

    const danoBase = numeroAleatorio(5, 15);

    let dano = danoBase;

    if (defendendo) {
        dano = Math.floor(danoBase / 2);

        adicionarLog(
            "🛡️ Sua defesa reduziu o dano!"
        );
    }

    jogador.vida -= dano;

    if (jogador.vida < 0) {
        jogador.vida = 0;
    }

    adicionarLog(
        `👹 O Goblin atacou e causou ${dano} de dano!`
    );

    atualizarTela();

    verificarFim();
}


// =============================
// VERIFICAR VITÓRIA / DERROTA
// =============================

function verificarFim() {

    if (inimigo.vida <= 0) {

        inimigo.vida = 0;

        adicionarLog(
            "🏆 Você derrotou o Goblin!"
        );

        jogador.nivel++;

        adicionarLog(
            `🎉 Você subiu para o nível ${jogador.nivel}!`
        );

        atualizarTela();
    }


    if (jogador.vida <= 0) {

        adicionarLog(
            "💀 Você foi derrotado!"
        );

        jogador.vida = 0;

        atualizarTela();
    }
}


// =============================
// ATUALIZAR INTERFACE
// =============================

function atualizarTela() {

    document.getElementById("player-level")
        .textContent = jogador.nivel;


    // VIDA DO JOGADOR

    const porcentagemVida =
        (jogador.vida / jogador.vidaMaxima) * 100;

    const barraVida =
        document.getElementById("player-hp");

    barraVida.style.width = porcentagemVida + "%";

    barraVida.textContent =
        `${jogador.vida} / ${jogador.vidaMaxima}`;


    // MANA

    const porcentagemMana =
        (jogador.mana / jogador.manaMaxima) * 100;

    const barraMana =
        document.getElementById("player-mana");

    barraMana.style.width = porcentagemMana + "%";

    barraMana.textContent =
        `${jogador.mana} / ${jogador.manaMaxima}`;


    // VIDA DO INIMIGO

    const porcentagemInimigo =
        (inimigo.vida / inimigo.vidaMaxima) * 100;

    const barraInimigo =
        document.getElementById("enemy-hp");

    barraInimigo.style.width =
        porcentagemInimigo + "%";

    barraInimigo.textContent =
        `${inimigo.vida} / ${inimigo.vidaMaxima}`;
}


// =============================
// LOG DA BATALHA
// =============================

function adicionarLog(mensagem) {

    const log =
        document.getElementById("battle-log");

    const texto =
        document.createElement("p");

    texto.textContent = mensagem;

    log.appendChild(texto);

    log.scrollTop = log.scrollHeight;
}


// =============================
// NÚMERO ALEATÓRIO
// =============================

function numeroAleatorio(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// =============================
// REINICIAR
// =============================

function reiniciarJogo() {

    jogador.vida = 100;
    jogador.mana = 50;
    jogador.nivel = 1;

    inimigo.vida = 80;

    document.getElementById("battle-log").innerHTML =
        "<p>⚔️ Uma nova batalha começou!</p>";

    atualizarTela();
}


// =============================
// INICIAR
// =============================

atualizarTela();
