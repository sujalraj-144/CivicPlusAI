from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import CORS_ORIGINS, UPLOAD_DIR
from routers import upload, analyze, predict, priority, issues

app = FastAPI(
    title="CivicPulse AI - Smart Cities Municipal Engine",
    description="Intelligent Civic Grievance Triage & Predictive Risk Platform for Smart Cities",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded media directory
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Include Routers matching project presentation blueprint
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(predict.router)
app.include_router(priority.router)
app.include_router(issues.router)

@app.get("/")
def root():
    return {
        "platform": "CivicPulse AI",
        "status": "Operational",
        "endpoints": {
            "upload": "POST /upload",
            "analyze": "POST /analyze",
            "predict": "GET /predict",
            "priority": "GET /priority",
            "issues": "GET /issues",
            "docs": "/docs"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
