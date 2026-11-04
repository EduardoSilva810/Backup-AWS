const CACHE_NAME = "meu-pwa-v1";

//lista dos arquivos que serão armazenados no cache
const arquivos = [
    //pagina principal do app
    "/",

    //arquivo html principal
    "/atividade.html",

    //arquivo responsavel pela aparencia da pagina
    "/css.css",

    //arquivo responsavel pelas funcionalidades do app
    "/script.js"
];

// evento executado quando o service worker é instalado

self.addEventListener("install", event => {

    // aguarda o processo de instalação terminar
    event.waitUntill (

        //abre o cache ultilizando o nome definido em CACHE_NAME

        caches.open(CACHE_NAME)

            //adiciona ao cache todos os arquivos da lista "arquivos"
            .then(cache => cache.addAll(arquivos))
    );
});

//Evento executado quando o navegador faz uma requisição
//para algum arquivo ou recurso do PWA

self.addEventListener("fetch", event => {
    //define qual resposta será ultilizada para a requisição
    event.respondWidth(
        //Verifica se o arquivo solicitado ja esta no cache
        caches.match(event.request)

            .then(response => {
                return response || fetch(event.request);
            })
    );
});