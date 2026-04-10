from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo import ReturnDocument

from server.db import issues_collection, orders_collection
from server.models.issue import IssueCreate, IssueResponse, IssueUpdate

router = APIRouter(prefix="/issues", tags=["issues"])


def serialize_issue(issue: dict) -> dict:
    return {
        "id": str(issue["_id"]),
        "orderId": str(issue["orderId"]),
        "type": issue["type"],
        "note": issue.get("note"),
        "status": issue["status"],
    }


@router.post("", response_model=IssueResponse, status_code=201)
def create_issue(payload: IssueCreate):
    if not ObjectId.is_valid(payload.orderId):
        raise HTTPException(status_code=400, detail="Invalid order id")

    order_exists = orders_collection.count_documents({"_id": ObjectId(payload.orderId)}, limit=1)
    if order_exists == 0:
        raise HTTPException(status_code=404, detail="Order not found")

    issue = payload.dict()
    issue["orderId"] = ObjectId(payload.orderId)
    result = issues_collection.insert_one(issue)
    issue["id"] = str(result.inserted_id)
    issue["orderId"] = payload.orderId
    return issue


@router.get("", response_model=List[IssueResponse])
def list_issues():
    results = issues_collection.find().sort("_id", -1)
    return [serialize_issue(issue) for issue in results]


@router.patch("/{issue_id}", response_model=IssueResponse)
def update_issue(issue_id: str, changes: IssueUpdate):
    if not ObjectId.is_valid(issue_id):
        raise HTTPException(status_code=400, detail="Invalid issue id")

    update_data = changes.dict(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    updated = issues_collection.find_one_and_update(
        {"_id": ObjectId(issue_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Issue not found")

    return serialize_issue(updated)
