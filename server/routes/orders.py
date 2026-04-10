from datetime import datetime
from typing import List, Optional

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from pymongo import ReturnDocument

from server.db import orders_collection
from server.models.order import OrderCreate, OrderResponse, OrderUpdate, OrderStatus

router = APIRouter(prefix="/orders", tags=["orders"])


def serialize_order(order: dict) -> dict:
    return {
        "id": str(order["_id"]),
        "customerName": order["customerName"],
        "instagramHandle": order.get("instagramHandle"),
        "product": order["product"],
        "price": order["price"],
        "status": order["status"],
        "created_at": order["created_at"],
    }


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(payload: OrderCreate):
    order = payload.dict()
    order["created_at"] = datetime.utcnow()
    result = orders_collection.insert_one(order)
    order["id"] = str(result.inserted_id)
    return order


@router.get("", response_model=List[OrderResponse])
def list_orders(
    status: Optional[OrderStatus] = Query(None),
    customerName: Optional[str] = Query(None),
):
    query = {}
    if status is not None:
        query["status"] = status.value
    if customerName:
        query["customerName"] = {"$regex": customerName, "$options": "i"}

    results = orders_collection.find(query).sort("created_at", -1)
    return [serialize_order(order) for order in results]


@router.patch("/{order_id}", response_model=OrderResponse)
def update_order(order_id: str, changes: OrderUpdate):
    if not ObjectId.is_valid(order_id):
        raise HTTPException(status_code=400, detail="Invalid order id")

    update_data = {k: v for k, v in changes.dict(exclude_none=True).items()}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    updated = orders_collection.find_one_and_update(
        {"_id": ObjectId(order_id)},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER,
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")

    return serialize_order(updated)
