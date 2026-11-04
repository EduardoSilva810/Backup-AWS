import logging

from fastapi import APIRouter, HTTPException

from app.models.ai_models import PerguntaRequest, RespostaAI
from app.providers.gemini_provider import GeminiProvider

router = APIRouter(prefix="/ia", tags=["Inteligência Artificial"])


@router.post("/gemini", response_model=RespostaAI)
def perguntar_gemini(dados: PerguntaRequest):

    try:
        gemini = GeminiProvider()

        resposta = gemini.generate_response(dados.pergunta)

        return RespostaAI(
            provedor="Google Gemini",
            modelo=gemini.model,
            resposta=resposta
        )

    except Exception:
        logging.exception("ERRO COMPLETO NA INTEGRACAO COM GEMINI")

        raise HTTPException(
            status_code=502,
            detail="Não foi possível obter uma resposta do Gemini."
        )