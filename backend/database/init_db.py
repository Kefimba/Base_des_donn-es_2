from app import create_app
from database.db import db

# Import models so SQLAlchemy metadata is aware of all tables.
from models import *  # noqa: F401,F403


app = create_app()

with app.app_context():
    db.create_all()
    print("Database tables created successfully.")
