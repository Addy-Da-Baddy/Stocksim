from flask import Flask
from flask_cors import CORS
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    CORS(app)
    jwt = JWTManager(app)

    from app.routes.stock import stock_bp
    from app.routes.transaction import transaction_bp
    from app.routes.portfolio import portfolio_bp
    from app.routes.auth import auth_bp
    from app.routes.market import market_bp
    from app.routes.community import community_bp
    from app.routes.leaderboard import leaderboard_bp
    from app.routes.news import news_bp
    from app.routes.admin import admin_bp
    from app.routes.admin_auth import admin_auth
    from app.routes.help import help_bp
    from app.routes.user import user_bp

    app.register_blueprint(stock_bp, url_prefix='/api')
    app.register_blueprint(transaction_bp, url_prefix='/api')
    app.register_blueprint(portfolio_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(market_bp, url_prefix='/api')
    app.register_blueprint(community_bp, url_prefix='/api')
    app.register_blueprint(leaderboard_bp, url_prefix='/api')
    app.register_blueprint(news_bp, url_prefix='/api')
    app.register_blueprint(help_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/super-secret-admin-zone')
    app.register_blueprint(admin_auth, url_prefix='/super-secret-admin-zone')
    with app.app_context():
        from app.models.user import User
        from app.models.portfolio import Portfolio
        from app.models.transaction import Transaction
        from app.models.stock_cache import StockCache

    return app
