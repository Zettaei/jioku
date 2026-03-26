////////////////////////////////////////////// LOGIN
export interface LoginRouteHandler {
    email: string;
    password: string;
}

export interface LoginRouteResponse {
    username: string;
    timezone: string;
}


////////////////////////////////////////////// REGISTER
export interface RegisterRouteHandler {
    username: string;
    email: string;
    password: string;
    timezone: string;
}

export interface RegisterRouteResponse {
    username: string;
}


////////////////////////////////////////////// TOKEN CHECK
export interface TokenCheckRouteResponse {
    username: string;
    timezone: string;
}
