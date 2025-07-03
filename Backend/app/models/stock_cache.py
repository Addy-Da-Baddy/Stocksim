from app import db
from datetime import datetime

class StockCache(db.Model):
    __tablename__ = 'stock_cache'

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(10), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    long_name = db.Column(db.String(255), nullable=True)
    logo_url = db.Column(db.String(255), nullable=True)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
