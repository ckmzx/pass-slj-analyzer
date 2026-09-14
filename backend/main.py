import os
import shutil
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from analyzer import analyze_slj_video

app = FastAPI(title="Performetrics SLJ Biomechanics Video Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "online", "system": "Performetrics Biomechanics Engine v1.0"}

@app.post("/api/analyze")
async def analyze_video(file: UploadFile = File(...), subject_name: str = "피험자 A", affiliation: str = "연수송도센터"):
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="동영상 파일(.mp4, .mov 등)만 업로드 가능합니다.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        results = analyze_slj_video(tmp_path, subject_name=subject_name, affiliation=affiliation)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"분석 중 오류 발생: {str(e)}")
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
