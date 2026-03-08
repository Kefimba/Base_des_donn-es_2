from __future__ import annotations

import os
from datetime import timedelta
from urllib.parse import quote_plus


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=8)

    DB_SERVER = os.getenv("DB_SERVER", "DESKTOP-VOHTE30\\PROJET_DBB2_G5")
    DB_NAME = os.getenv("DB_NAME", "gestion_scolaire")
    DB_USER = os.getenv("DB_USER", "sa")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "ProjetDBB2@G5")
    DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 17 for SQL Server")
    DB_ENCRYPT = os.getenv("DB_ENCRYPT", "no")
    DB_TRUST_SERVER_CERT = os.getenv("DB_TRUST_SERVER_CERT", "yes")

    SQLALCHEMY_DATABASE_URI = (
        "mssql+pyodbc://"
        f"{quote_plus(DB_USER)}:{quote_plus(DB_PASSWORD)}@"
        f"{DB_SERVER}/{DB_NAME}"
        f"?driver={quote_plus(DB_DRIVER)}"
        f"&Encrypt={quote_plus(DB_ENCRYPT)}"
        f"&TrustServerCertificate={quote_plus(DB_TRUST_SERVER_CERT)}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
