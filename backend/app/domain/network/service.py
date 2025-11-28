from functools import lru_cache

from fastapi import Request

from app.domain.network.models import NetworkInfoResponse, NetworkSettings


class NetworkService:
    """Service for network information operations."""

    @staticmethod
    @lru_cache
    def get_settings() -> NetworkSettings:
        """Cached settings loader."""
        return NetworkSettings()

    def get_network_info(self, request: Request) -> NetworkInfoResponse:
        """
        Constructs the network info response.

        Args:
            request: The FastAPI Request object to determine client IP.
        """
        settings = self.get_settings()

        forwarded = request.headers.get("X-Forwarded-For")
        real_ip = request.headers.get("X-Real-IP")

        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        elif real_ip:
            client_ip = real_ip
        elif request.client:
            client_ip = request.client.host
        else:
            client_ip = "Unknown"

        return NetworkInfoResponse(
            location=settings.location,
            map_url=settings.map_url,
            facility=settings.facility,
            facility_url=settings.facility_url,
            looking_glass_ipv4=settings.ipv4,
            looking_glass_ipv6=settings.ipv6,
            your_ip=client_ip,
        )
