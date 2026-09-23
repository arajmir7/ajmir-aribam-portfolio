"""HTTP input contract for persisted contact inquiries."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class InquiryInput(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    topic: str
    message: str = Field(min_length=10, max_length=4000)
    website: str = Field(default="", max_length=200)

    @field_validator("topic")
    @classmethod
    def valid_topic(cls, value: str) -> str:
        if value not in {"project", "role", "question"}:
            raise ValueError("Choose a valid topic")
        return value
