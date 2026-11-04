
import os
from google import genai
from dotenv import load_dotenv

# Carrega as configurações do arquivo .env
load_dotenv()


class GeminiProvider:

    def __init__(self):
        # Recupera a chave armazenada no servidor
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("Chave da API Gemini não configurada.")

        # Inicializa o cliente do Google
        self.client = genai.Client(api_key=api_key)

        # Modelo utilizado
        self.model = "gemini-flash-latest"

    def generate_response(self, prompt: str):
        # Envia a pergunta para o Gemini
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        # Retorna somente o texto gerado
        return response.text
