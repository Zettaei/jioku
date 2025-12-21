import { Hono } from "hono";

const routes = new Hono();

import { routes as deckRoute }  from "./deck.js";
import { routes as cardRoute } from "./card.js";
import { routes as studyRoute } from "./study.js";
import { routes as reviewRoute } from "./review.js";

routes.route("/", deckRoute);
routes.route("/", cardRoute);
routes.route("/", studyRoute);
routes.route("/", reviewRoute);


export { 
    routes
};