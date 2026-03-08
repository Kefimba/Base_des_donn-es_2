from __future__ import annotations

from sqlalchemy import text

from database.db import db


def find_existing_table(candidates: list[str]) -> str | None:
    for name in candidates:
        # SQL Server: OBJECT_ID returns NULL when object does not exist.
        exists = db.session.execute(
            text("SELECT CASE WHEN OBJECT_ID(:obj_name, 'U') IS NULL THEN 0 ELSE 1 END"),
            {"obj_name": f"dbo.{name}"},
        ).scalar()
        if int(exists or 0) == 1:
            return name
    return None


def get_timetable_table_name() -> str | None:
    return find_existing_table(["emploi_temps", "emploi_du_temps", "EmploiTemps"])
