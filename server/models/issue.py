from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class IssueType(str, Enum):
    return_ = "return"
    exchange = "exchange"
    complaint = "complaint"


class IssueStatus(str, Enum):
    open = "open"
    resolved = "resolved"


class IssueBase(BaseModel):
    orderId: str = Field(..., min_length=1)
    type: IssueType
    note: Optional[str] = None
    status: IssueStatus = IssueStatus.open


class IssueCreate(IssueBase):
    pass


class IssueUpdate(BaseModel):
    status: Optional[IssueStatus] = None


class IssueResponse(IssueBase):
    id: str

    class Config:
        orm_mode = True
