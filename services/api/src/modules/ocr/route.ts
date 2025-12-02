import { Hono } from "hono";
import { sendImgToOCR } from "./service.js";

const routes = new Hono();

// BUG: only english image filename work for now, might fix later
// OPTIMIZE: resize photo before sending (probably should be OCR job tho)
routes.post("/", async (c) => {
    const file = (await c.req.parseBody())["file"];

    if(!file) {
        return c.text("Missing file", 400);
    }

    const ocrFormData = new FormData();
    ocrFormData.set("file", file);

    try {
        const result = await sendImgToOCR(ocrFormData);
        return c.json(result);
    }
    catch(err)
    {
        console.error(err);
        return c.text("Error related to OCR", 500);
    }
});


export default routes;