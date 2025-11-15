from paddleocr import PaddleOCR
import cv2
import numpy as np
from src.config import OCR_MODELS, OCR_OPTIONS


ocr = PaddleOCR(**OCR_MODELS, **OCR_OPTIONS, lang="japan")


def run_ocr(image_bytes: bytes) -> dict[str, list]:

    np_arr = np.frombuffer(image_bytes, np.uint8)   # read to memory
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)  # decode to BGR image

    result = ocr.predict(img)

    rec_texts = result[0]['rec_texts']      # result texts
    rec_scores = result[0]['rec_scores']    # result score/confidence
    rec_polys = result[0]['rec_polys']      # result boxes

    # this rearrange might slow down a bit, idk, but it's more readable, easier useable
    results = {
        "texts": rec_texts,
        "scores": rec_scores,
        "polys": rec_polys
    }

    return results