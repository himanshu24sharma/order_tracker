from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from server.routes.orders import router as orders_router
from server.routes.issues import router as issues_router

app = FastAPI(
    title="Order Tracker API",
    description="Minimal order and issue tracking backend for Instagram sellers.",
    version="0.1.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders_router)
app.include_router(issues_router)


@app.get("/", tags=["root"])
def root():
    return {"message": "Order Tracker API is running."}


@app.get("/", tags=["root"])
def root():
    return {"message": "Order Tracker API is running."}
