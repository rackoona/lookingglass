from typing import Annotated

from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse

from app.core.limiter import limiter
from app.domain.speedtest import SpeedtestService

router = APIRouter(prefix="/speedtest", tags=["Speedtest"])


@router.get("/100M")
@limiter.limit("2/minute")
def get_100m_speedtest(
    request: Request,
    service: Annotated[SpeedtestService, Depends(SpeedtestService)],
):
    size_mb = service.mb_100()
    return StreamingResponse(
        service.generate_dummy_data(size_mb),
        headers=service.get_response_headers("100M", size_mb),
    )


@router.get("/1G")
@limiter.limit("2/minute")
def get_1g_speedtest(
    request: Request,
    service: Annotated[SpeedtestService, Depends(SpeedtestService)],
):
    size_mb = service.mb_1g()
    return StreamingResponse(
        service.generate_dummy_data(size_mb),
        headers=service.get_response_headers("1G", size_mb),
    )


@router.get("/10G")
@limiter.limit("1/minute")
def get_10g_speedtest(
    request: Request,
    service: Annotated[SpeedtestService, Depends(SpeedtestService)],
):
    size_mb = service.mb_10g()
    return StreamingResponse(
        service.generate_dummy_data(size_mb),
        headers=service.get_response_headers("10G", size_mb),
    )
