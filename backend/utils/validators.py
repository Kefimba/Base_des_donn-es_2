from __future__ import annotations

from datetime import datetime


def parse_date(value: str | None):
    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d").date()


def require_fields(payload: dict, fields: list[str]) -> list[str]:
    return [field for field in fields if not payload.get(field)]
