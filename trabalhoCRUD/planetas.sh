
#!/bin/bash

# ==========================================
# CRUD DE PLANETAS - DEBIAN + REDIS + DIALOG
# ==========================================

CONTAINER_NAME="redis-debian-instancia"

# Verifica se o dialog esta instalado
if ! command -v dialog >/dev/null 2>&1; then
    echo "Instalando o dialog..."
    sudo apt-get update && sudo apt-get install -y dialog
fi

# Verifica se o Docker esta instalado
if ! command -v docker >/dev/null 2>&1; then
    echo "Erro: Docker nao esta instalado."
    exit 1
fi

# Funcao para mostrar mensagens
msg() {
    dialog --title "Sistema de Planetas" --msgbox "$1" 10 50
}

# Funcao para executar comandos no Redis
redis() {
    docker exec -i "$CONTAINER_NAME" redis-cli --raw "$@"
}

# Verifica se o container esta funcionando
if ! docker ps --format '{{.Names}}' | grep -Fxq "$CONTAINER_NAME"; then

    if docker container inspect "$CONTAINER_NAME" >/dev/null 2>&1; then
        docker start "$CONTAINER_NAME" >/dev/null
    else
        docker run -d \
            --name "$CONTAINER_NAME" \
            -p 6379:6379 \
            redis:latest >/dev/null
    fi

    sleep 2
fi

# Testa a conexao com o Redis
if [ "$(redis PING 2>/dev/null)" != "PONG" ]; then
    msg "Nao foi possivel conectar ao Redis."
    exit 1
fi

# Cadastra um planeta
cadastrar_planeta() {
    NOME=$(dialog --inputbox "Nome do planeta:" 8 45 3>&1 1>&2 2>&3) || return

    if [ -z "$NOME" ]; then
        msg "O nome nao pode ficar vazio."
        return
    fi

    # Impede nomes duplicados, ignorando maiusculas e minusculas
    ID_EXISTENTE=$(redis GET "planeta:nome:$NOME")

    if [ -n "$ID_EXISTENTE" ]; then
        msg "Ja existe um planeta com esse nome."
        return
    fi

    TIPO=$(dialog --inputbox "Tipo do planeta (rochoso, gasoso etc.):" 8 50 3>&1 1>&2 2>&3) || return
    TAMANHO=$(dialog --inputbox "Tamanho em km (diametro):" 8 45 3>&1 1>&2 2>&3) || return
    LUAS=$(dialog --inputbox "Quantidade de luas:" 8 45 3>&1 1>&2 2>&3) || return

    if [ -z "$TIPO" ] || [[ ! "$TAMANHO" =~ ^[0-9]+$ ]] || [[ ! "$LUAS" =~ ^[0-9]+$ ]]; then
        msg "Dados invalidos. Informe o tipo e numeros inteiros positivos ou zero para tamanho e luas."
        return
    fi

    ID=$(redis INCR "planeta:proximo_id")

    redis HSET "planeta:$ID" \
        nome "$NOME" \
        tipo "$TIPO" \
        tamanho "$TAMANHO" \
        luas "$LUAS" >/dev/null

    redis SET "planeta:nome:$NOME" "$ID" >/dev/null
    redis SADD "planeta:ids" "$ID" >/dev/null

    msg "Planeta cadastrado com sucesso!\n\nID: $ID\nNome: $NOME"
}

# Lista os planetas cadastrados
listar_planetas() {
    IDS=$(redis SMEMBERS "planeta:ids")

    if [ -z "$IDS" ]; then
        msg "Nenhum planeta cadastrado."
        return
    fi

    TEXTO="PLANETAS CADASTRADOS\n\n"

    while IFS= read -r ID; do
        [ -z "$ID" ] && continue

        NOME=$(redis HGET "planeta:$ID" nome)
        TIPO=$(redis HGET "planeta:$ID" tipo)

        TEXTO+="ID: $ID | $NOME | $TIPO\n"
    done <<< "$IDS"

    dialog --title "Lista de Planetas" --msgbox "$TEXTO" 20 65
}

# Consulta os dados de um planeta
consultar_planeta() {
    ID=$(dialog --inputbox "Digite o ID do planeta:" 8 40 3>&1 1>&2 2>&3) || return

    if [ -z "$(redis SISMEMBER planeta:ids "$ID")" ] || \
       [ "$(redis SISMEMBER planeta:ids "$ID")" = "0" ]; then
        msg "Planeta nao encontrado."
        return
    fi

    NOME=$(redis HGET "planeta:$ID" nome)
    TIPO=$(redis HGET "planeta:$ID" tipo)
    TAMANHO=$(redis HGET "planeta:$ID" tamanho)
    LUAS=$(redis HGET "planeta:$ID" luas)

    msg "DADOS DO PLANETA\n\nID: $ID\nNome: $NOME\nTipo: $TIPO\nDiametro: $TAMANHO km\nLuas: $LUAS"
}

# Atualiza um planeta
editar_planeta() {
    ID=$(dialog --inputbox "Digite o ID do planeta que deseja editar:" 8 50 3>&1 1>&2 2>&3) || return

    if [ "$(redis SISMEMBER planeta:ids "$ID")" != "1" ]; then
        msg "Planeta nao encontrado."
        return
    fi

    NOME_ANTIGO=$(redis HGET "planeta:$ID" nome)
    TIPO_ANTIGO=$(redis HGET "planeta:$ID" tipo)
    TAMANHO_ANTIGO=$(redis HGET "planeta:$ID" tamanho)
    LUAS_ANTIGO=$(redis HGET "planeta:$ID" luas)

    NOME=$(dialog --inputbox "Novo nome:" 8 45 "$NOME_ANTIGO" 3>&1 1>&2 2>&3) || return
    TIPO=$(dialog --inputbox "Novo tipo:" 8 45 "$TIPO_ANTIGO" 3>&1 1>&2 2>&3) || return
    TAMANHO=$(dialog --inputbox "Novo diametro em km:" 8 45 "$TAMANHO_ANTIGO" 3>&1 1>&2 2>&3) || return
    LUAS=$(dialog --inputbox "Nova quantidade de luas:" 8 45 "$LUAS_ANTIGO" 3>&1 1>&2 2>&3) || return

    if [ -z "$NOME" ] || [ -z "$TIPO" ] || \
       [[ ! "$TAMANHO" =~ ^[0-9]+$ ]] || [[ ! "$LUAS" =~ ^[0-9]+$ ]]; then
        msg "Dados invalidos. Edicao cancelada."
        return
    fi

    ID_OUTRO=$(redis GET "planeta:nome:$NOME")

    if [ -n "$ID_OUTRO" ] && [ "$ID_OUTRO" != "$ID" ]; then
        msg "Outro planeta ja utiliza esse nome."
        return
    fi

    redis DEL "planeta:nome:$NOME_ANTIGO" >/dev/null

    redis HSET "planeta:$ID" \
        nome "$NOME" \
        tipo "$TIPO" \
        tamanho "$TAMANHO" \
        luas "$LUAS" >/dev/null

    redis SET "planeta:nome:$NOME" "$ID" >/dev/null

    msg "Planeta atualizado com sucesso!"
}

# Exclui um planeta
excluir_planeta() {
    ID=$(dialog --inputbox "Digite o ID do planeta que deseja excluir:" 8 50 3>&1 1>&2 2>&3) || return

    if [ "$(redis SISMEMBER planeta:ids "$ID")" != "1" ]; then
        msg "Planeta nao encontrado."
        return
    fi

    NOME=$(redis HGET "planeta:$ID" nome)

    dialog --yesno "Deseja realmente excluir o planeta $NOME?" 8 50

    if [ $? -ne 0 ]; then
        msg "Exclusao cancelada."
        return
    fi

    redis DEL "planeta:$ID" "planeta:nome:$NOME" >/dev/null
    redis SREM "planeta:ids" "$ID" >/dev/null

    msg "Planeta excluido com sucesso!"
}

# Menu principal
while true; do
    OPCAO=$(dialog --clear \
        --title "CRUD DE PLANETAS - REDIS" \
        --menu "Escolha uma operacao:" 17 60 7 \
        1 "Cadastrar planeta" \
        2 "Listar planetas" \
        3 "Consultar planeta por ID" \
        4 "Editar planeta" \
        5 "Excluir planeta" \
        6 "Testar conexao Redis" \
        7 "Sair" \
        3>&1 1>&2 2>&3)

    if [ $? -ne 0 ]; then
        break
    fi

    case "$OPCAO" in
        1) cadastrar_planeta ;;
        2) listar_planetas ;;
        3) consultar_planeta ;;
        4) editar_planeta ;;
        5) excluir_planeta ;;
        6) msg "Resposta do Redis: $(redis PING)" ;;
        7) break ;;
    esac
done

clear
echo "Sistema CRUD de Planetas encerrado."
