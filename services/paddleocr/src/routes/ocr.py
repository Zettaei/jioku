from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from src.utils.allowed_file import allowed_file
from src.utils.rearrange_result import rearrange_result
from src.services import verify_key, run_ocr, logger, error_handler
import time


router = APIRouter()


@router.post("/ocr", dependencies=[Depends(verify_key)])
async def ocr(file: UploadFile = File(...)):  # File(...) = no default but this required
    
    if not allowed_file(file.filename):
        text = "File type not allowed"
        logger.warning("OCR_ERROR | %s: %s", text, file.filename)
        raise HTTPException(status_code=400, detail=text)

    try:
        image_bytes = await file.read()

    except Exception:
        text = "Failed to read uploaded file"
        logger.error("OCR_ERROR | %s", text, exc_info=True)
        raise HTTPException(status_code=500, detail=text)

    try:
        start_timer = time.perf_counter()
        raw_result = run_ocr(image_bytes)
        arranged_result = rearrange_result(raw_result)
        elapsed_time = time.perf_counter() - start_timer

        texts = raw_result.get("texts")
        char_len = 0
        if (texts is not None):
            char_len = sum(len(str(t)) for t in texts)

        logger.info("OCR_INFO | ocr_time: %.3f, char_len: %d", elapsed_time, char_len)
        return {"filename": file.filename, "result": arranged_result}
    
    except Exception:
        text = "Something wrong with OCR server"
        logger.error("OCR_ERROR | %s", text, exc_info=True)
        raise HTTPException(status_code=500, detail=text)
    
    finally:
         # UploadFile handle this automatically, this is just in case
         file.file.close()
