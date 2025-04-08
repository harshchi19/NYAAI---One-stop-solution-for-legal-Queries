from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from dotenv import load_dotenv
from courtroom_logic import run_courtroom_simulation
from utils import extract_text_from_pdf

load_dotenv()

app = FastAPI(title="AI Courtroom Debate API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your React domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Courtroom backend is running!"}

@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_path = f"uploads/{file.filename}"
    os.makedirs("uploads", exist_ok=True)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    case_text = extract_text_from_pdf(file_path)
    if not case_text.strip():
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty or unreadable.")

    return {"case_text": case_text[:1000]}  # For preview

@app.post("/simulate/")
async def simulate_debate(case_text: str):
    try:
        result = run_courtroom_simulation(case_text)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
