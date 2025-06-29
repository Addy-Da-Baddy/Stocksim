from app import db
from datetime import datetime

class CommunityPurchase(db.Model):
    __tablename__ = 'community_purchase'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('community_shop.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref='community_purchases', lazy=True)
    item = db.relationship('CommunityShop', backref='purchases', lazy=True)

