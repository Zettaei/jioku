import { Hono } from "hono";
import * as ocr from "modules/ocr/index.js";

const routes = new Hono();

routes.get("/entries", async (c) => {
    const query = c.req.query("q");
   
    

    const result = ocr.services.processOCR(c);
    
});
    

routes.post("/entries/ocr", async (c) => {

    const result = ocr.services.processOCR(c);

    return
});


export { routes };