import { Hono } from "hono";

const routes = new Hono();

import { routes as deckRoute }  from "./deck.js";
import { routes as cardRoute } from "./card.js";

routes.route("/", deckRoute);
routes.route("/", cardRoute);


export { 
    routes
};