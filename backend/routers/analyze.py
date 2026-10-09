from fastapi import APIRouter, HTTPException, Body
from typing import Optional
from pathlib import Path
from config import UPLOAD_DIR
from ml.yolo_detector import detector

router = APIRouter(prefix="", tags=["AI Detection"])

@router.post("/analyze")
async def analyze_issue_photo(
    image_url: str = Body(..., embed=True),
    description_hint: Optional[str] = Body(None, embed=True)
):
    """
    [POST] /analyze
    Runs YOLO computer vision model on the uploaded civic image.
    Returns:
      - detected_type (Pothole, Garbage Dump, Waterlogging, etc.)
      - confidence (e.g. 0.92)
      - initial_severity (0-100)
      - department responsible
      - bounding_box coordinates
    """
    # Extract filename from url
    file_name = Path(image_url).name
    file_path = str(UPLOAD_DIR / file_name)

    # Perform YOLO analysis
    analysis_result = detector.analyze_image(file_path, hint_text=description_hint or "")

    return {
        "status": "success",
        "image_url": image_url,
        "detection": analysis_result
    }
