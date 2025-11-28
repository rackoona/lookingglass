from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import get_settings
from app.core.limiter import limiter
from app.routes.lookingglass import router as lookingglass_router
from app.routes.network import router as network_router
from app.routes.speedtest import router as speedtest_router

load_dotenv()

settings = get_settings()
app = FastAPI()

# CORS Configuration - Loaded from environment variables
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_credentials,
    allow_methods=settings.cors_methods_list,
    allow_headers=settings.cors_headers_list,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore
app.add_middleware(SlowAPIMiddleware)

app.include_router(speedtest_router)
app.include_router(lookingglass_router)
app.include_router(network_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
