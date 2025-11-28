import os
from functools import lru_cache


class Settings:
    """Application settings loaded from environment variables."""

    def __init__(self) -> None:
        # CORS Configuration
        self.cors_origins = os.getenv("CORS_ORIGINS", "*")
        self.cors_credentials = (
            os.getenv("CORS_CREDENTIALS", "true").lower() == "true"
        )
        self.cors_methods = os.getenv("CORS_METHODS", "*")
        self.cors_headers = os.getenv("CORS_HEADERS", "*")

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def cors_methods_list(self) -> list[str]:
        """Parse CORS methods from comma-separated string."""
        return [method.strip() for method in self.cors_methods.split(",")]

    @property
    def cors_headers_list(self) -> list[str]:
        """Parse CORS headers from comma-separated string."""
        return [header.strip() for header in self.cors_headers.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Cached settings loader."""
    return Settings()
