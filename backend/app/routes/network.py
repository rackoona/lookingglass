from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app.domain.network import NetworkInfoResponse, NetworkService

router = APIRouter(prefix="/network", tags=["Network"])


@router.get("/info", response_model=NetworkInfoResponse)
def get_network_info(
    request: Request,
    service: Annotated[NetworkService, Depends(NetworkService)],
) -> NetworkInfoResponse:
    return service.get_network_info(request)
