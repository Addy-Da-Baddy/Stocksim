from app import db
from datetime import datetime

class CommunityShop(db.Model):
    __tablename__ = 'community_shop'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    cost = db.Column(db.Float, nullable=False)
    score_value = db.Column(db.Integer, nullable=False)
    emoji = db.Column(db.String(10), nullable=False)
    available = db.Column(db.Boolean, default=True)

    
    