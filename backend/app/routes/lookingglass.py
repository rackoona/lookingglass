from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from app.core.limiter import limiter
from app.domain.lookingglass import LookingGlassService
from app.domain.lookingglass.models import MTRRequest, PingRequest, TracerouteRequest

router = APIRouter(prefix="/lookingglass", tags=["LookingGlass"])


@router.post("/ping")
@limiter.limit("2/minute")
async def ping(
    request: Request,
    body: PingRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute ping diagnostic with real-time streaming output.

    The response streams ping output line-by-line as it executes.

    Security: Ping parameters (count, timeout, size) are server-controlled
    to prevent abuse. Only the target address can be specified by the user.
    """
    return StreamingResponse(
        service.ping_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/ping6")
@limiter.limit("2/minute")
async def ping6(
    request: Request,
    body: PingRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute ping6 (IPv6) diagnostic with real-time streaming output.

    Security: All parameters are server-controlled to prevent abuse.
    """
    return StreamingResponse(
        service.ping6_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/traceroute")
@limiter.limit("2/minute")
async def traceroute(
    request: Request,
    body: TracerouteRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute traceroute with real-time streaming output.

    Security: Max hops and wait time are server-controlled to prevent abuse.
    """
    return StreamingResponse(
        service.traceroute_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/traceroute6")
@limiter.limit("2/minute")
async def traceroute6(
    request: Request,
    body: TracerouteRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute traceroute6 (IPv6) with real-time streaming output.

    Security: Max hops and wait time are server-controlled to prevent abuse.
    """
    return StreamingResponse(
        service.traceroute6_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/mtr")
@limiter.limit("2/minute")
async def mtr(
    request: Request,
    body: MTRRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute MTR (My Traceroute) with real-time streaming output.

    MTR combines ping and traceroute functionality for comprehensive
    network path analysis.

    Security: Report cycles and DNS settings are server-controlled.
    """
    return StreamingResponse(
        service.mtr_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/mtr6")
@limiter.limit("2/minute")
async def mtr6(
    request: Request,
    body: MTRRequest,
    service: Annotated[LookingGlassService, Depends(LookingGlassService)],
):
    """
    Execute MTR6 (My Traceroute for IPv6) with real-time streaming output.

    Security: Report cycles and DNS settings are server-controlled.
    """
    return StreamingResponse(
        service.mtr6_stream(body),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
