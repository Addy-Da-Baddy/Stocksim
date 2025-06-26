from app import create_app, db

from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.models.stock_cache import StockCache

app = create_app()

with app.app_context():
    print("[*] Creating all tables...")
    db.create_all()
    print("[+] Tables created successfully!")
