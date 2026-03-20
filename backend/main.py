from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import data, train, predict, visualize, compare, recommend, history

app = FastAPI(
    title="AutoInsight API",
    description="No-code ML Analytics Backend",
    version="2.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data.router)
app.include_router(train.router)
app.include_router(predict.router)
app.include_router(visualize.router)
app.include_router(compare.router)
app.include_router(recommend.router)
app.include_router(history.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to AutoInsight API", "version": "2.0.0"}
