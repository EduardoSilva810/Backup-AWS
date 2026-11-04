/* =========================
   EFEITO MÁQUINA DE ESCREVER
========================= */


const texto = 
"Nem tudo pode ser explicado com palavras...";

const typewriter = document.getElementById("typewriter");

let index = 0;


function escrever(){

    if(index < texto.length){

        typewriter.innerHTML += texto.charAt(index);

        index++;

        setTimeout(escrever,80);

    }

}


window.onload = () => {

    escrever();

};



/* =========================
   CONTADOR DE TEMPO
========================= */


// coloque aqui a data que deseja começar

const dataInicio = new Date("2026-01-01 00:00:00");


function atualizarTempo(){


    const agora = new Date();


    const diferenca = agora - dataInicio;


    const segundosTotal = Math.floor(
        diferenca / 1000
    );


    const dias = Math.floor(
        segundosTotal / 86400
    );


    const horas = Math.floor(
        (segundosTotal % 86400) / 3600
    );


    const minutos = Math.floor(
        (segundosTotal % 3600) / 60
    );


    const segundos =
        segundosTotal % 60;



    document.getElementById("clock").innerHTML =

    `
    ${dias} Dias |
    ${horas} Horas |
    ${minutos} Minutos |
    ${segundos} Segundos
    `;


}


setInterval(atualizarTempo,1000);

atualizarTempo();



/* =========================
   TERMINAL DIGITANDO
========================= */


const mensagens = [

"Inicializando sistema...",

"Carregando memórias...",

"Analisando pessoa encontrada...",

"Nome: Especial",

"Sorriso: Incrível",

"Personalidade: Única",

"Carisma: 100%",

"Resultado encontrado...",

"",

"ERRO:",

"Não foi possível parar de pensar nela ❤️"

];


const terminal = document.getElementById("console");


let linha = 0;


function escreverTerminal(){


    if(linha < mensagens.length){


        terminal.innerHTML += 
        mensagens[linha] + "\n";


        linha++;


        setTimeout(
            escreverTerminal,
            700
        );


    }


}



const observerTerminal =
new IntersectionObserver(entries=>{


    if(entries[0].isIntersecting){

        escreverTerminal();

        observerTerminal.disconnect();

    }


});


observerTerminal.observe(
document.querySelector("#terminal")
);




/* =========================
   ANIMAÇÃO AO ROLAR
========================= */


const elementos = document.querySelectorAll(
"section"
);


function revelar(){


    elementos.forEach(sec=>{


        const altura =
        sec.getBoundingClientRect().top;


        if(
            altura <
            window.innerHeight - 100
        ){

            sec.classList.add("reveal");

        }


    });


}


window.addEventListener(
"scroll",
revelar
);



/* =========================
   PARTÍCULAS NO FUNDO
========================= */


const fundo =
document.getElementById("particles");



for(let i=0;i<80;i++){


    let estrela =
    document.createElement("span");


    estrela.style.position="absolute";


    estrela.style.width="3px";


    estrela.style.height="3px";


    estrela.style.background="white";


    estrela.style.borderRadius="50%";


    estrela.style.left =
    Math.random()*100+"%";


    estrela.style.top =
    Math.random()*100+"%";


    estrela.style.opacity =
    Math.random();



    estrela.animate(

    [

        {
        transform:"translateY(0)"
        },

        {
        transform:"translateY(-30px)"
        }

    ],

    {

        duration:
        3000+
        Math.random()*5000,


        iterations:
        Infinity,


        direction:
        "alternate"

    }


    );


    fundo.appendChild(estrela);


}



/* =========================
   CORAÇÕES FLUTUANDO
========================= */


function criarCoracao(){


    const coracao =
    document.createElement("div");


    coracao.className="heart";


    coracao.innerHTML="❤️";


    coracao.style.left =
    Math.random()*100+"vw";


    coracao.style.animationDuration =
    (3+
    Math.random()*4)
    +"s";


    document.body.appendChild(
        coracao
    );



    setTimeout(()=>{


        coracao.remove();


    },7000);


}


setInterval(
criarCoracao,
800
);




/* =========================
   BOTÃO FINAL
========================= */


const sim =
document.getElementById("yes");


sim.addEventListener(
"click",
()=>{


    document.body.innerHTML = `

    <div style="
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    flex-direction:column;
    background:#0f172a;
    color:white;
    text-align:center;
    padding:30px;
    ">


    <h1 style="
    font-size:60px;
    color:#f472b6;
    ">

    ❤️

    </h1>


    <h2>

    Eu sabia que você sorriria.

    </h2>


    <p style="
    margin-top:20px;
    font-size:20px;
    ">

    Obrigado por chegar até aqui.

    </p>


    </div>

    `;


});




/* =========================
   BOTÃO DIVERTIDO
========================= */


const nao =
document.getElementById("no");


nao.addEventListener(
"mouseover",
()=>{


    nao.style.transform =

    `
    translate(
    ${Math.random()*200-100}px,
    ${Math.random()*100-50}px
    )
    `;


});