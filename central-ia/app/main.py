
from fastapi import FastAPI
from app.routes.ai_routes import router as ai_router

app = FastAPI(
    title="Central de Inteligências Artificiais",
    description="Sistema de integração com múltiplos provedores de IA.",
    version="1.0.0"
)


@app.get("/")
def inicio():
    return {
        "mensagem": "Central de IAs funcionando!",
        "status": "online",
        "versao": "1.0.0"
    }


@app.get("/status")
def status():
    return {
        "api": "ativa",
        "sistema": "Central de IAs"
    }


app.include_router(ai_router)

