// =============================
// MENU MOBILE
// =============================

const menuButton = document.getElementById("menuButton");

const nav = document.querySelector(".navbar nav");


menuButton.addEventListener("click", () => {

    nav.classList.toggle("active");

});


// =============================
// FECHAR MENU AO CLICAR
// =============================

const links = document.querySelectorAll(".navbar nav a");


links.forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("active");

    });

});


// =============================
// EFEITO PARALLAX DO PERSONAGEM
// =============================

const character =
    document.querySelector(".character");


document.addEventListener("mousemove", (event) => {

    const x =
        (window.innerWidth / 2 - event.clientX) / 40;

    const y =
        (window.innerHeight / 2 - event.clientY) / 40;


    if (character) {

        character.style.transform =
            `translate(${x}px, ${y}px)`;

    }

});


// =============================
// ANIMAÇÃO DOS PROJETOS
// =============================

const cards =
    document.querySelectorAll(".project-card");


const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform =
                    "translateY(0)";

            }

        });

    },

    {
        threshold: 0.15
    }

);


cards.forEach((card, index) => {

    card.style.opacity = "0";

    card.style.transform = "translateY(50px)";

    card.style.transition =
        `0.6s ease ${index * 0.15}s`;

    observer.observe(card);

});


// =============================
// TEXTO DO TÍTULO
// =============================

const phrases = [

    "DESENVOLVEDOR",

    "PROGRAMADOR",

    "CRIADOR",

    "ESTUDANTE DE DS"

];

let phraseIndex = 0;

const title =
    document.querySelector(".hero h2");


setInterval(() => {

    phraseIndex++;

    if (phraseIndex >= phrases.length) {

        phraseIndex = 0;

    }

    title.style.opacity = "0";


    setTimeout(() => {

        title.textContent =
            phrases[phraseIndex];

        title.style.opacity = "1";

    }, 300);

}, 3000);