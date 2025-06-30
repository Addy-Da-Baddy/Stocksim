from app import db

class LearningArticle(db.Model):
    __tablename__ = 'learning_articles'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    summary = db.Column(db.Text)
    content = db.Column(db.Text)
    source_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=db.func.now())
