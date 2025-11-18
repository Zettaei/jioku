from fastapi import Request


def get_client_ip(request: Request) -> str:
    client_ip: str = request.client.host

    return client_ip