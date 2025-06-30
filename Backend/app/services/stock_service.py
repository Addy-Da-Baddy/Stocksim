import yfinance as yf
from app.models.stock_cache import StockCache
from app import db
from datetime import datetime

def get_stock_price(symbol):
    cached = StockCache.query.filter_by(symbol=symbol.upper()).first()
    now = datetime.utcnow()
    if cached and (now - cached.last_updated).total_seconds() < 3600:
        return {
            'symbol': cached.symbol,
            'price': cached.price,
            'last_updated': cached.last_updated.isoformat()
        }
    try:
        stock = yf.Ticker(symbol.upper())
        data = stock.history(period='1d')
        if data.empty:
            return {'error': 'No data found for the symbol'}
        
        price = data['Close'].iloc[-1]
        if cached:
            cached.price = price
            cached.last_updated = now
        else:
            cached = StockCache(symbol=symbol.upper(), price=price, last_updated=now)
        
        db.session.add(cached)
        db.session.commit()
        
        return {
            'symbol': cached.symbol,
            'price': price,
            'last_updated': cached.last_updated.isoformat()
        }
    except Exception as e:
         return {
            "error": f"Failed to fetch stock price for {symbol}: {str(e)}"
        }
    