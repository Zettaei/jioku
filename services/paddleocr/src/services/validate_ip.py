from fastapi import HTTPException, Request
from src.config import WHITELISTED_IP
from src.services import logger
from src.utils import get_client_ip


def _validate_ip(request: Request):
    client_ip = get_client_ip(request)

    if client_ip not in WHITELISTED_IP:
        text = "IP not allowed"
        logger.warning("IP_FORBIDDEN | blocked request from %s", client_ip)
        raise HTTPException(status_code=403, detail=text)

    return client_ip

def _novalidate_ip(request: Request):
    client_ip = get_client_ip(request)

    return client_ip


validate_ip = _novalidate_ip if (len(WHITELISTED_IP) <= 1 and WHITELISTED_IP[0] == '') else _validate_ip

__all__ = ["validate_ip"]