import os

from pydantic import BaseModel, Field


class NetworkSettings(BaseModel):
    """Configuration settings for the network domain."""

    location: str = Field(
        default_factory=lambda: os.getenv("NETWORK_LOCATION", "Unknown Location")
    )
    map_url: str = Field(default_factory=lambda: os.getenv("NETWORK_MAP_URL", ""))
    facility: str = Field(
        default_factory=lambda: os.getenv("NETWORK_FACILITY", "Unknown Facility")
    )
    facility_url: str = Field(
        default_factory=lambda: os.getenv("NETWORK_FACILITY_URL", "")
    )
    ipv4: str = Field(default_factory=lambda: os.getenv("NETWORK_IPV4", ""))
    ipv6: str = Field(default_factory=lambda: os.getenv("NETWORK_IPV6", ""))


class NetworkInfoResponse(BaseModel):
    """Response model for network information."""

    location: str
    map_url: str
    facility: str
    facility_url: str
    looking_glass_ipv4: str
    looking_glass_ipv6: str
    your_ip: str
