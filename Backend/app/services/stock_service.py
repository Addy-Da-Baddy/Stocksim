import yfinance as yf
from app.models.stock_cache import StockCache
from app import db
from datetime import datetime

def get_stock_price(symbol):
    cached = StockCache.query.filter_by(symbol=symbol.upper()).first()
    now = datetime.utcnow()

    # Even with a cached price, we need to calculate the change, which requires fresh data.
    # The cache will be updated with the latest price, but change is calculated dynamically.
    
    try:
        stock = yf.Ticker(symbol.upper())
        data = stock.history(period='2d') # Fetch last 2 days to calculate change
        
        if data.empty:
            return {'error': 'No data found for the symbol'}
        
        price = data['Close'].iloc[-1]
        
        if len(data) > 1:
            previous_close = data['Close'].iloc[-2]
            change = price - previous_close
            percent_change = (change / previous_close) * 100 if previous_close != 0 else 0
        else:
            # Fallback if only one day of data is available
            daily_open = data['Open'].iloc[-1]
            change = price - daily_open
            percent_change = (change / daily_open) * 100 if daily_open != 0 else 0

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
            'change': change,
            'percent_change': percent_change,
            'last_updated': cached.last_updated.isoformat()
        }
    except Exception as e:
         return {
            "error": f"Failed to fetch stock price for {symbol}: {str(e)}"
        }
