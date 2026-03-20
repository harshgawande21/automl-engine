import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import APP_NAME, APP_VERSION, CORS_ORIGINS, DEBUG
from app.core.logging import logger
from app.database.db import init_db
from app.api import (
    auth_routes, user_routes, data_routes, model_routes,
    prediction_routes, monitoring_routes, explainability_routes,
    evaluation_routes, websocket_routes
)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AutoInsight Machine Learning Engine API",
    debug=DEBUG
)

# CORS
# use a regex to accept any localhost port (development convenience)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"^http://localhost(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup Event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up MI Engine...")
    init_db()
    logger.info("Database initialized.")

# Routes
app.include_router(auth_routes.router)
app.include_router(user_routes.router)
app.include_router(data_routes.router)
app.include_router(model_routes.router)
app.include_router(prediction_routes.router)
app.include_router(monitoring_routes.router)
app.include_router(explainability_routes.router)
app.include_router(evaluation_routes.router)
app.include_router(websocket_routes.router)

@app.get("/")
def root():
    return {"message": f"Welcome to {APP_NAME} v{APP_VERSION}", "status": "running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
