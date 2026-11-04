// ========================================
// CONFIGURAÇÃO DO LOCALSTORAGE
// ========================================

const STORAGE_KEY = "jojoCharacters";


// ========================================
// CARREGAR PERSONAGENS
// ========================================

function loadCharacters() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    // Se já existem personagens salvos,
    // retorna eles.
    if (savedData !== null) {

        return JSON.parse(savedData);

    }


    // Se ainda não existe nada salvo,
    // cria os personagens iniciais.

    const initialCharacters = [

        {
            id: 1,
            name: "Jotaro Kujo",
            stand: "Star Platinum",
            type: "Humanoide",

            destructivePower: "A",
            speed: "A",
            range: "C",
            durability: "A",
            precision: "A",
            development: "C"
        },

        {
            id: 2,
            name: "Dio Brando",
            stand: "The World",
            type: "Humanoide",

            destructivePower: "A",
            speed: "A",
            range: "C",
            durability: "A",
            precision: "B",
            development: "B"
        }

    ];


    // Salva os personagens iniciais
    // no navegador.

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialCharacters)
    );


    return initialCharacters;
}


// ========================================
// ARRAY PRINCIPAL
// ========================================

let characters = loadCharacters();


// ========================================
// SALVAR PERSONAGENS
// ========================================

function saveCharacters() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(characters)
    );

}


// ========================================
// ELEMENTOS DO HTML
// ========================================

const characterForm =
    document.getElementById("characterForm");

const characterId =
    document.getElementById("characterId");

const characterName =
    document.getElementById("characterName");

const standName =
    document.getElementById("standName");

const standType =
    document.getElementById("standType");

const destructivePower =
    document.getElementById("destructivePower");

const speed =
    document.getElementById("speed");

const range =
    document.getElementById("range");

const durability =
    document.getElementById("durability");

const precision =
    document.getElementById("precision");

const development =
    document.getElementById("development");

const characterGrid =
    document.getElementById("characterGrid");

const totalCharacters =
    document.getElementById("totalCharacters");

const totalStands =
    document.getElementById("totalStands");

const cancelBtn =
    document.getElementById("cancelBtn");

const submitBtn =
    document.getElementById("submitBtn");

const formTitle =
    document.getElementById("formTitle");


// ========================================
// ATUALIZAR INTERFACE
// ========================================

function updateUI() {

    characterGrid.innerHTML = "";

    totalCharacters.textContent =
        characters.length;

    totalStands.textContent =
        characters.length;


    // Se não houver personagens

    if (characters.length === 0) {

        characterGrid.innerHTML = `
            <div class="col-span-full bg-cardbg border border-gray-800 rounded-xl p-10 text-center">

                <p class="text-gray-400">
                    Nenhum personagem cadastrado.
                </p>

            </div>
        `;

        return;
    }


    // Criar os cards

    characters.forEach(character => {

        const card =
            document.createElement("div");


        card.className = `
            bg-cardbg
            border
            border-gray-800
            rounded-xl
            p-5
            shadow-lg
        `;


        card.innerHTML = `

            <div class="mb-5">

                <h3 class="text-xl font-bold text-white">
                    ${character.name}
                </h3>

                <p class="text-jojo font-semibold mt-1">
                    ${character.stand}
                </p>

                <span class="inline-block mt-2 text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full">
                    ${character.type}
                </span>

            </div>


            <div class="space-y-3">

                ${createStatus(
                    "Poder Destrutivo",
                    character.destructivePower
                )}

                ${createStatus(
                    "Velocidade",
                    character.speed
                )}

                ${createStatus(
                    "Alcance",
                    character.range
                )}

                ${createStatus(
                    "Durabilidade",
                    character.durability
                )}

                ${createStatus(
                    "Precisão",
                    character.precision
                )}

                ${createStatus(
                    "Potencial de Desenvolvimento",
                    character.development
                )}

            </div>


            <div class="flex gap-2 mt-5">

                <button
                    onclick="editCharacter(${character.id})"
                    class="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
                >
                    Editar
                </button>

                <button
                    onclick="deleteCharacter(${character.id})"
                    class="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg"
                >
                    Excluir
                </button>

            </div>

        `;


        characterGrid.appendChild(card);

    });

}


// ========================================
// CRIAR STATUS
// ========================================

function createStatus(name, value) {

    return `

        <div class="flex items-center justify-between">

            <span class="text-sm text-gray-400">
                ${name}
            </span>

            <span
                class="
                    w-8
                    h-8
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-jojo
                    font-bold
                    text-white
                "
            >
                ${value || "∞"}
            </span>

        </div>

    `;

}


// ========================================
// CADASTRAR / EDITAR
// ========================================

characterForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const id =
            characterId.value;


        const characterData = {

            name:
                characterName.value.trim(),

            stand:
                standName.value.trim(),

            type:
                standType.value,

            destructivePower:
                destructivePower.value || "∞",

            speed:
                speed.value || "∞",

            range:
                range.value || "∞",

            durability:
                durability.value || "∞",

            precision:
                precision.value || "∞",

            development:
                development.value || "∞"

        };


        // ====================================
        // EDITAR
        // ====================================

        if (id) {

            characters = characters.map(
                character => {

                    if (
                        character.id === Number(id)
                    ) {

                        return {
                            id: Number(id),
                            ...characterData
                        };

                    }

                    return character;

                }
            );

        }


        // ====================================
        // CADASTRAR
        // ====================================

        else {

            const newCharacter = {

                id: Date.now(),

                ...characterData

            };


            characters.push(newCharacter);

        }


        // ====================================
        // SALVAR
        // ====================================

        saveCharacters();


        // ====================================
        // ATUALIZAR TELA
        // ====================================

        updateUI();


        // ====================================
        // LIMPAR FORMULÁRIO
        // ====================================

        resetForm();

    }
);


// ========================================
// EDITAR
// ========================================

function editCharacter(id) {

    const character =
        characters.find(
            character =>
                character.id === id
        );


    if (!character) {
        return;
    }


    characterId.value =
        character.id;

    characterName.value =
        character.name;

    standName.value =
        character.stand;

    standType.value =
        character.type;

    destructivePower.value =
        character.destructivePower || "∞";

    speed.value =
        character.speed || "∞";

    range.value =
        character.range || "∞";

    durability.value =
        character.durability || "∞";

    precision.value =
        character.precision || "∞";

    development.value =
        character.development || "∞";


    formTitle.textContent =
        "Editar Personagem";

    submitBtn.textContent =
        "Salvar Alterações";

    cancelBtn.classList.remove(
        "hidden"
    );

}


// ========================================
// EXCLUIR
// ========================================

function deleteCharacter(id) {

    const character =
        characters.find(
            character =>
                character.id === id
        );


    if (!character) {
        return;
    }


    const confirmed =
        confirm(
            `Deseja excluir ${character.name}?`
        );


    if (!confirmed) {
        return;
    }


    characters =
        characters.filter(
            character =>
                character.id !== id
        );


    // Salvar depois da exclusão

    saveCharacters();


    // Atualizar tela

    updateUI();


    // Limpar formulário

    resetForm();

}


// ========================================
// RESETAR FORMULÁRIO
// ========================================

function resetForm() {

    characterForm.reset();

    characterId.value = "";


    destructivePower.value = "∞";

    speed.value = "∞";

    range.value = "∞";

    durability.value = "∞";

    precision.value = "∞";

    development.value = "∞";


    formTitle.textContent =
        "Cadastrar Personagem";

    submitBtn.textContent =
        "Cadastrar";

    cancelBtn.classList.add(
        "hidden"
    );

}


// ========================================
// CANCELAR
// ========================================

cancelBtn.addEventListener(
    "click",
    function() {

        resetForm();

    }
);


// ========================================
// INICIAR
// ========================================

updateUI();