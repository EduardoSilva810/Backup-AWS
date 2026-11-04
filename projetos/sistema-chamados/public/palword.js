
const API_URL = "http://ec2-3-92-145-136.compute-1.amazonaws.com:3000/chamados";

// Elementos do HTML
const formulario = document.getElementById("formChamado");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");
const campoPrioridade = document.getElementById("prioridade");

const listaChamados = document.getElementById("listaChamados");
const mensagem = document.getElementById("mensagem");
const botaoSalvar = document.getElementById("botaoSalvar");
const botaoAtualizar = document.getElementById("botaoAtualizar");

const totalChamados = document.getElementById("totalChamados");
const chamadosAndamento = document.getElementById("chamadosAndamento");
const chamadosResolvidos = document.getElementById("chamadosResolvidos");

// Guarda o ID do chamado que está sendo editado.
// Se for null, o formulário criará um novo chamado.
let chamadoEditando = null;

// Converte textos em um formato seguro para inserir no HTML.
function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];
    });
}

// Padroniza o texto para comparar status e prioridades.
function normalizar(valor) {
    return String(valor ?? "")
        .trim()
        .toLowerCase()
        .replaceAll(" ", "_");
}

// Mostra mensagens para o usuário.
function mostrarMensagem(texto, erro = false) {
    mensagem.textContent = texto;
    mensagem.style.color = erro ? "#b34338" : "#39752c";
}

// Atualiza os números dos cartões de resumo.
function atualizarResumo(chamados) {
    totalChamados.textContent = chamados.length;

    chamadosAndamento.textContent = chamados.filter(chamado => {
        return normalizar(chamado.status) === "em_andamento";
    }).length;

    chamadosResolvidos.textContent = chamados.filter(chamado => {
        return normalizar(chamado.status) === "resolvido";
    }).length;
}

// Carrega os chamados do backend.
async function carregarChamados() {
    listaChamados.innerHTML =
        '<p class="carregando">Carregando chamados...</p>';

    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Não foi possível buscar os chamados.");
        }

        const chamados = await resposta.json();

        atualizarResumo(chamados);
        renderizarChamados(chamados);
    } catch (erro) {
        console.error(erro);

        listaChamados.innerHTML = `
            <p class="lista-vazia">
                Não foi possível carregar os chamados.
                Verifique se o servidor está funcionando.
            </p>
        `;
    }
}

// Cria os cartões de cada chamado na tela.
function renderizarChamados(chamados) {
    if (!Array.isArray(chamados) || chamados.length === 0) {
        listaChamados.innerHTML = `
            <p class="lista-vazia">
                🌿 Nenhum chamado cadastrado ainda.
                Registre o primeiro usando o formulário!
            </p>
        `;
        return;
    }

    listaChamados.innerHTML = chamados.map(chamado => {
        const status = normalizar(chamado.status || "aberto");
        const prioridade = normalizar(chamado.prioridade || "media");

        const nomesStatus = {
            aberto: "Aberto",
            em_andamento: "Em andamento",
            resolvido: "Resolvido"
        };

        const nomesPrioridade = {
            baixa: "Baixa",
            media: "Média",
            alta: "Alta"
        };

        const classeStatus = [
            "aberto",
            "em_andamento",
            "resolvido"
        ].includes(status) ? status : "aberto";

        const classePrioridade = [
            "baixa",
            "media",
            "alta"
        ].includes(prioridade) ? prioridade : "media";

        return `
            <article class="chamado">
                <div class="chamado-topo">
                    <h3>${escaparHTML(chamado.titulo)}</h3>

                    <span class="tag">
                        #${escaparHTML(chamado.id)}
                    </span>
                </div>

                <p class="chamado-descricao">
                    ${escaparHTML(chamado.descricao || "Sem descrição.")}
                </p>

                <div class="chamado-detalhes">
                    <span class="tag status-${classeStatus}">
                        ${nomesStatus[classeStatus]}
                    </span>

                    <span class="tag prioridade-${classePrioridade}">
                        Prioridade: ${nomesPrioridade[classePrioridade]}
                    </span>
                </div>

                <div class="acoes-chamado">
                    <button
                        type="button"
                        class="botao-acao"
                        data-acao="status"
                        data-id="${escaparHTML(chamado.id)}"
                    >
                        Alterar status
                    </button>

                    <button
                        type="button"
                        class="botao-acao"
                        data-acao="editar"
                        data-id="${escaparHTML(chamado.id)}"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="botao-acao botao-excluir"
                        data-acao="excluir"
                        data-id="${escaparHTML(chamado.id)}"
                    >
                        Excluir
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

// Cadastra um chamado novo ou salva uma edição.
formulario.addEventListener("submit", async evento => {
    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();
    const prioridade = campoPrioridade.value;

    if (!titulo || !descricao) {
        mostrarMensagem("Preencha o título e a descrição.", true);
        return;
    }

    const dados = {
        titulo,
        descricao,
        prioridade
    };

    const editando = chamadoEditando !== null;

    if (editando) {
        dados.status = chamadoEditando.status;
    }

    const url = editando
        ? `${API_URL}/${encodeURIComponent(chamadoEditando.id)}`
        : API_URL;

    const metodo = editando ? "PUT" : "POST";

    botaoSalvar.disabled = true;
    botaoSalvar.textContent = editando
        ? "Salvando alterações..."
        : "Criando chamado...";

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(
                resultado.erro ||
                resultado.mensagem ||
                "Não foi possível salvar o chamado."
            );
        }

        formulario.reset();
        cancelarEdicao();

        mostrarMensagem(
            editando
                ? "Chamado atualizado com sucesso!"
                : "Chamado criado com sucesso!"
        );

        await carregarChamados();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, true);
    } finally {
        botaoSalvar.disabled = false;

        if (chamadoEditando === null) {
            botaoSalvar.textContent = "+ Criar chamado";
        } else {
            botaoSalvar.textContent = "Salvar alterações";
        }
    }
});

// Localiza um chamado pelo ID.
async function buscarChamadoPorId(id) {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
        throw new Error("Não foi possível consultar os chamados.");
    }

    const chamados = await resposta.json();

    return chamados.find(chamado => String(chamado.id) === String(id));
}

// Prepara o formulário para editar um chamado existente.
async function editarChamado(id) {
    try {
        const chamado = await buscarChamadoPorId(id);

        if (!chamado) {
            throw new Error("Chamado não encontrado.");
        }

        chamadoEditando = chamado;

        campoTitulo.value = chamado.titulo || "";
        campoDescricao.value = chamado.descricao || "";
        campoPrioridade.value = normalizar(chamado.prioridade || "media");

        botaoSalvar.textContent = "Salvar alterações";
        mostrarMensagem("Editando o chamado #" + chamado.id);

        formulario.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        campoTitulo.focus();
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

// Cancela o modo de edição.
function cancelarEdicao() {
    chamadoEditando = null;
    botaoSalvar.textContent = "+ Criar chamado";
}

// Altera o status entre aberto, em andamento e resolvido.
async function alterarStatus(id) {
    try {
        const chamado = await buscarChamadoPorId(id);

        if (!chamado) {
            throw new Error("Chamado não encontrado.");
        }

        const statusAtual = normalizar(chamado.status || "aberto");

        const proximoStatus = {
            aberto: "em_andamento",
            em_andamento: "resolvido",
            resolvido: "aberto"
        };

        const novoStatus = proximoStatus[statusAtual] || "aberto";

        const resposta = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    titulo: chamado.titulo,
                    descricao: chamado.descricao,
                    prioridade: chamado.prioridade,
                    status: novoStatus
                })
            }
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível alterar o status.");
        }

        mostrarMensagem(
            "Status alterado para: " +
            novoStatus.replace("_", " ") + "."
        );

        await carregarChamados();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, true);
    }
}

// Exclui um chamado do banco de dados.
async function excluirChamado(id) {
    const confirmar = window.confirm(
        "Tem certeza que deseja excluir o chamado #" + id + "?"
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/${encodeURIComponent(id)}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(
                resultado.erro ||
                resultado.mensagem ||
                "Não foi possível excluir o chamado."
            );
        }

        if (
            chamadoEditando !== null &&
            String(chamadoEditando.id) === String(id)
        ) {
            formulario.reset();
            cancelarEdicao();
        }

        mostrarMensagem("Chamado excluído com sucesso!");
        await carregarChamados();
    } catch (erro) {
        console.error(erro);
        mostrarMensagem(erro.message, true);
    }
}

// Escuta os cliques nos botões dos cartões.
listaChamados.addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    if (acao === "editar") {
        editarChamado(id);
    } else if (acao === "status") {
        alterarStatus(id);
    } else if (acao === "excluir") {
        excluirChamado(id);
    }
});

// Atualiza a lista manualmente.
botaoAtualizar.addEventListener("click", carregarChamados);

// Carrega os chamados assim que a página é aberta.
carregarChamados();
