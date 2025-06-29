from app import create_app, db
from sqlalchemy import inspect

from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.transaction import Transaction
from app.models.stock_cache import StockCache
from app.models.community_shop import CommunityShop
from app.models.community_purchase import CommunityPurchase

app = create_app()

with app.app_context():
    inspector = inspect(db.engine)
    existing_tables = set(inspector.get_table_names())

    all_models = {
        "users": User,
        "portfolio": Portfolio,
        "transactions": Transaction,
        "stock_cache": StockCache,
        "community_shop": CommunityShop,
        "community_purchase": CommunityPurchase,
    }

    print("[*] Checking and creating tables...")
    for table_name, model in all_models.items():
        if table_name in existing_tables:
            print(f"[=] Table '{table_name}' already exists — skipping")
        else:
            print(f"[+] Creating table '{table_name}'")
            model.__table__.create(bind=db.engine)

    print("[✔] Table check complete.")
