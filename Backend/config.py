from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    db_url = os.environ.get('DATABASE_URL')
    
    SQLALCHEMY_ENGINE_OPTIONS = {}
    if db_url:
        if 'mysql' in db_url and '?ssl=true' in db_url:
            # Handle SSL for MySQL (like SkySQL)
            SQLALCHEMY_DATABASE_URI = db_url.split('?')[0]
            SQLALCHEMY_ENGINE_OPTIONS['connect_args'] = {'ssl': {'true': True}}
        elif 'postgresql' in db_url and not 'sslmode' in db_url:
            # Add sslmode for Render's PostgreSQL if not present
            SQLALCHEMY_DATABASE_URI = f"{db_url}?sslmode=require"
        else:
            SQLALCHEMY_DATABASE_URI = db_url
    else:
        # Fallback to a local SQLite database
        SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-super-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another-super-secret-key'
