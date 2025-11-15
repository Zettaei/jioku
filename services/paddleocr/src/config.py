from pathlib import Path

MODEL_DIR = Path(__file__).parent.parent / "ocr_models"

#
# https://www.paddleocr.ai/latest/en/version3.x/pipeline_usage/OCR.html#1-ocr-pipeline-introduction
# I got models from this, though if you dont provided one it will automatically download one
#

OCR_MODELS = {
    # COMMENTED OUT or None 
    # to use auto downloaded official models

    # "doc_orientation_classify_model_name": "PP-LCNet_x1_0_doc_ori",
    # "doc_orientation_classify_model_dir": MODEL_DIR / "PP-LCNet_x1_0_doc_ori_infer",
    
    # "doc_unwarping_model_name": "PP-LCNet_x1_0_doc_ori",
    # "doc_unwarping_model_dir": MODEL_DIR / "PP-LCNet_x1_0_doc_ori_infer",
    
    # "text_detection_model_name": "PP-OCRv5_server_det",
    # "text_detection_model_dir": MODEL_DIR / "PP-OCRv5_server_det_infer",
    
    # "textline_orientation_model_name": "PP-OCRv5_server_rec",
    # "textline_orientation_model_dir": MODEL_DIR / "PP-OCRv5_server_rec_infer",
    # textline_orientation_batch_size: Any | None = None,

    # "text_recognition_model_name": "UVDoc",
    # "text_recognition_model_dir": MODEL_DIR / "UVDoc_infer",
    # text_recognition_batch_size: Any | None = None
}

###
### FOR WHATEVER INPUT_SHAPE REASON THE UVDoc CAN'T BE USED
### SO I HAVE TO USE THE AUTOMATIC DOWNLOADED ONE
###
### FUNNILY ENOUGH EVEN WHEN I TRIED TO COPY THE ENTIRE
### UVDoc OF THE USABLE ONE IN MY MODELS FOLDER, IT'S 
### STILL BROKEN
###


OCR_OPTIONS = {
    "use_doc_orientation_classify": True,
    "use_doc_unwarping": True,
    "use_textline_orientation": True,
    # text_det_limit_side_len: False,
    # text_det_limit_type: Any | None = None,
    # text_det_thresh: Any | None = None,
    # text_det_box_thresh: Any | None = None,
    # text_det_unclip_ratio: Any | None = None,
    # text_rec_score_thresh: Any | None = None,
    # return_word_box: Any | None = None
}


# use_doc_orientation_classify: True | False
#       Whether to run document orientation classification
#       Detects if the page is rotated (0°, 90°, 180°, 270°) and auto-rotates it

# use_doc_unwarping: True | False
#       Whether to rectify warped pages (like scanned books)
#       Corrects curved text lines caused by folds, bends, or warped documents

# use_textline_orientation: True | False,
#       Classifies each text line’s orientation individually
#       Useful if your text lines are vertical/horizontal mixed
