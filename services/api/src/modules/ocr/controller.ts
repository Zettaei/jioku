express = require("express")
multer = require("multer")

app = express()
upload = multer()

app.post("/ocr", upload.single("image"), async (req, res) => {
    
    await fetch(process.env["OCR_HOST"] + "/ocr", {
        method: 'POST',
        headers: {
        'Content-Type': 'multipart/form-data',
        }
    })
    .then((res) => {

    })
    .catch((err) => {
        console.error(err)
    })
});


export default ocr;