from flask import Flask
from flask_cors import CORS
from config import Config
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)
    from app.routes.stock import stock_bp
    from app.routes.transaction import transaction_bp
    from app.routes.portfolio import portfolio_bp
    from app.routes.auth import auth_bp
    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(transaction_bp, url_prefix='/api')
    app.register_blueprint(portfolio_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    with app.app_context():
        from app.models.user import User
        from app.models.portfolio import Portfolio
        from app.models.transaction import Transaction
        from app.models.stock_cache import StockCache

    return app
