from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.support_agent import analyze_customer_issue
from backend.memory import close_hindsight

app = FastAPI(title="ISP Customer Support Intelligence")
@app.on_event("shutdown")
async def shutdown_event():
    await close_hindsight()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    customer_id: str
    issue: str


@app.get("/")
def root():
    return {"status": "online"}


@app.get("/api/health")
def health():
    return {"status": "online"}


@app.post("/api/analyze")
async def analyze(request: AnalyzeRequest):
    result = await analyze_customer_issue(
    request.customer_id,
    request.issue
)

    return {
        "customer_id": request.customer_id,
        "issue": request.issue,
        "result": result
    }
