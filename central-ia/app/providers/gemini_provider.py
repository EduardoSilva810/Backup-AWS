import os

from google import genai
from dotenv import load_dotenv

from app.providers.base_provider import BaseAIProvider


# Carrega as configurações do arquivo .env
load_dotenv("/var/www/html/central-ia/.env")


class GeminiProvider(BaseAIProvider):

    provider_name = "Google Gemini"
    model = "gemini-3.8-flash"

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("Chave da API Gemini não configurada.")

        self.client = genai.Client(api_key=api_key)

    def generate_response(self, prompt: str) -> str:

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return response.text