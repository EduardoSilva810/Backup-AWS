
from pydantic import BaseModel, Field


class PerguntaRequest(BaseModel):
    pergunta: str = Field(min_length=1, max_length=10000)


class RespostaAI(BaseModel):
    provedor: str
    modelo: str
    resposta: str
