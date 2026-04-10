from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class OrderStatus(str, Enum):
    new = "new"
    packed = "packed"
    shipped = "shipped"
    delivered = "delivered"


class OrderBase(BaseModel):
    customerName: str = Field(..., min_length=1)
    instagramHandle: Optional[str] = None
    product: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    status: OrderStatus = OrderStatus.new


class OrderCreate(OrderBase):
    pass


class OrderUpdate(BaseModel):
    customerName: Optional[str] = None
    instagramHandle: Optional[str] = None
    product: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    status: Optional[OrderStatus] = None


class OrderResponse(OrderBase):
    id: str
    created_at: datetime

    class Config:
        orm_mode = True
