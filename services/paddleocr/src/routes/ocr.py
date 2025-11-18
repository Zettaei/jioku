from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Request
from src.utils import allowed_file, get_client_ip, rearrange_result, count_chars
from src.services import run_ocr, logger, verify_key
from src.config import HAS_API_KEY
import time


router = APIRouter()
dependencies = [Depends(verify_key)] if HAS_API_KEY else []

@router.post("/ocr", dependencies=dependencies)
async def ocr(request: Request, file: UploadFile = File(...)):  # File(...) = no default but this required
    
    client_ip: str = get_client_ip(request)


    if not allowed_file(file.filename):
        text = "File type not allowed"
        logger.warning("IMAGE_FILE - %s | %s: %s", client_ip, text, file.filename)
        raise HTTPException(status_code=400, detail=text)
    

    try:
        image_bytes = await file.read()

    except Exception:
        text = "Failed to read uploaded file"
        logger.error("OCR_ERROR - %s | %s", client_ip, text, exc_info=True)
        raise HTTPException(status_code=500, detail=text)
    

    try:
        start_timer = time.perf_counter()
        raw_result = run_ocr(image_bytes)
        arranged_result = rearrange_result(raw_result)
        elapsed_time = time.perf_counter() - start_timer

        texts = raw_result.get("texts")
        char_len = count_chars(texts)

        logger.info("OCR_INFO - %s | ocr_time: %.3fs, char_len: %d", client_ip, elapsed_time, char_len)
        return {"filename": file.filename, "result": arranged_result}
    
    except Exception:
        text = "Something wrong with OCR server"
        logger.error("OCR_ERROR - %s | %s", client_ip, text, exc_info=True)
        raise HTTPException(status_code=500, detail=text)
    
    finally:
         # UploadFile handle this automatically, this is just in case
         file.file.close()
