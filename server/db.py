from os import getenv
from pathlib import Path

from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

MONGO_URI = getenv("MONGO_URI")
DB_NAME = getenv("DB_NAME")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is required")

if not DB_NAME:
    raise ValueError("DB_NAME environment variable is required")

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
orders_collection = db["orders"]
issues_collection = db["issues"]
