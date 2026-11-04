/* =========================
   TEXTO DIGITANDO
========================= */


const texto = 
"Uma pequena surpresa para alguém que estou conhecendo...";


const typing =
document.getElementById("typing");


let posicao = 0;


function escreverTexto(){


    if(posicao < texto.length){


        typing.innerHTML += 
        texto.charAt(posicao);


        posicao++;


        setTimeout(
            escreverTexto,
            70
        );


    }


}


window.addEventListener(
"load",
escreverTexto
);





/* =========================
   BOTÃO ABRIR
========================= */


function abrir(){


    document
    .getElementById("sobre")
    .scrollIntoView({

        behavior:"smooth"

    });


}







/* =========================
   TERMINAL
========================= */


const linhas = [

"Inicializando análise...",


"",

"Pessoa encontrada:",


"",

"✓ Conversa interessante",


"✓ Boa energia",


"✓ Fácil de conversar",


"✓ Vale a pena conhecer melhor",


"",

"Status:",


"Continuar descobrindo ✨"

];



const terminal =
document.getElementById("console");


let atual = 0;



function escreverTerminal(){


    if(atual < linhas.length){


        terminal.innerHTML +=

        linhas[atual] + "\n";


        atual++;


        setTimeout(

            escreverTerminal,

            600

        );


    }


}




const obs =

new IntersectionObserver(

(entries)=>{


    if(entries[0].isIntersecting){


        escreverTerminal();


        obs.disconnect();


    }


}

);



obs.observe(

document.querySelector("#terminal")

);







/* =========================
   ESTRELAS NO FUNDO
========================= */


const fundo =
document.getElementById("background");



for(
let i = 0;
i < 80;
i++
){


    const estrela =
    document.createElement("span");



    estrela.style.position =
    "absolute";


    estrela.style.width =
    "3px";


    estrela.style.height =
    "3px";


    estrela.style.background =
    "white";


    estrela.style.borderRadius =
    "50%";


    estrela.style.left =
    Math.random()*100 + "%";


    estrela.style.top =
    Math.random()*100 + "%";


    estrela.style.opacity =
    Math.random();



    estrela.animate(

        [

            {
                transform:
                "translateY(0px)"
            },


            {
                transform:
                "translateY(-40px)"
            }


        ],


        {

            duration:
            3000 +
            Math.random()*4000,


            iterations:
            Infinity,


            direction:
            "alternate"


        }


    );



    fundo.appendChild(
        estrela
    );


}







/* =========================
   LUZ SEGUINDO O MOUSE
========================= */


document.addEventListener(

"mousemove",

(e)=>{


    document.body.style.setProperty(

        "--x",

        e.clientX + "px"

    );


    document.body.style.setProperty(

        "--y",

        e.clientY + "px"

    );


}

);








/* =========================
   ANIMAÇÃO AO APARECER
========================= */


const elementos =

document.querySelectorAll(

".card, .item, .final-box, .gallery img"

);



const aparecer =

new IntersectionObserver(

(entries)=>{


    entries.forEach(

    elemento=>{


        if(elemento.isIntersecting){


            elemento.target.classList.add(

                "aparecer"

            );


        }


    }

    );


}

);




elementos.forEach(

elemento=>{


    aparecer.observe(elemento);


}

);







/* =========================
   BOTÃO FINAL
========================= */


function mensagem(){


    alert(

    "Obrigado por ler até aqui 🙂\n\nQue tal continuar essa conversa?"

    );


}