import shutil
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from config import UPLOAD_DIR

router = APIRouter(prefix="", tags=["Upload"])

@router.post("/upload")
async def upload_photo(
    file: UploadFile = File(...),
    latitude: float = Form(12.9716),
    longitude: float = Form(77.5946),
    address: str = Form("Reported GPS Location"),
    ward_number: str = Form("Ward 12 - Indiranagar")
):
    """
    [POST] /upload
    Receives photo and location coordinates from citizen browser.
    Saves image into municipal cloud/file storage.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted.")

    file_ext = Path(file.filename).suffix or ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/uploads/{unique_filename}"

    return {
        "status": "success",
        "file_name": unique_filename,
        "image_url": image_url,
        "latitude": latitude,
        "longitude": longitude,
        "address": address,
        "ward_number": ward_number
    }
