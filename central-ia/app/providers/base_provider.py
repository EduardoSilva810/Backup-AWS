from abc import ABC, abstractmethod


class BaseAIProvider(ABC):

    provider_name = None
    model = None

    @abstractmethod
    def generate_response(self, prompt: str) -> str:
        pass