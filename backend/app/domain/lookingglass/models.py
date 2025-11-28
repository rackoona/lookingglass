import re

from pydantic import BaseModel, Field, field_validator

ALLOWED_TARGET_PATTERN: re.Pattern[str] = re.compile(
    r"^(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?|(?:\[)?(?:[A-Fa-f0-9:]+)(?:\])?)$"
)
DANGEROUS_CHARS_PATTERN: re.Pattern[str] = re.compile(r"[;&|`$\\\n\r]")
MAX_TARGET_LENGTH = 253  # Maximum valid hostname length


class NetworkTarget(BaseModel):
    """Base model for a network target"""

    target: str = Field(description="IP address or hostname")

    @field_validator("target")
    @classmethod
    def validate_target(cls, value: str) -> str:
        if (
            not value
            or len(value) > MAX_TARGET_LENGTH
            or DANGEROUS_CHARS_PATTERN.search(value)
            or not ALLOWED_TARGET_PATTERN.fullmatch(value)
        ):
            raise ValueError("Invalid target")

        return value


class PingRequest(NetworkTarget):
    """Request model for pinging a network target - only accepts target"""

    pass  # Only inherits 'target' field from NetworkTarget


class TracerouteRequest(NetworkTarget):
    """Request model for traceroute - only accepts target"""

    pass  # Only inherits 'target' field from NetworkTarget


class MTRRequest(NetworkTarget):
    """Request model for MTR - only accepts target"""

    pass  # Only inherits 'target' field from NetworkTarget
