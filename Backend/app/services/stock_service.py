import yfinance as yf
from app.models.stock_cache import StockCache
from app import db
from datetime import datetime, timedelta

def get_stock_price(symbol):
    cached = StockCache.query.filter_by(symbol=symbol.upper()).first()
    now = datetime.utcnow()

    # If cache exists and is recent, use it for info, but still get fresh price data
    if cached and cached.last_updated > now - timedelta(days=1) and cached.long_name:
        long_name = cached.long_name
        logo_url = cached.logo_url
    else:
        try:
            stock_info = yf.Ticker(symbol.upper()).info
            long_name = stock_info.get('longName')
            logo_url = stock_info.get('logo_url')
        except Exception:
            long_name = None
            logo_url = None

    try:
        stock = yf.Ticker(symbol.upper())
        data = stock.history(period='2d')
        
        if data.empty:
            return {'error': 'No data found for the symbol'}
        
        price = data['Close'].iloc[-1]
        
        if len(data) > 1:
            previous_close = data['Close'].iloc[-2]
            change = price - previous_close
            percent_change = (change / previous_close) * 100 if previous_close != 0 else 0
        else:
            daily_open = data['Open'].iloc[-1]
            change = price - daily_open
            percent_change = (change / daily_open) * 100 if daily_open != 0 else 0

        if cached:
            cached.price = price
            cached.long_name = long_name
            cached.logo_url = logo_url
            cached.last_updated = now
        else:
            cached = StockCache(
                symbol=symbol.upper(), 
                price=price, 
                long_name=long_name, 
                logo_url=logo_url, 
                last_updated=now
            )
        
        db.session.add(cached)
        db.session.commit()
        
        return {
            'symbol': cached.symbol,
            'price': round(price, 3),
            'change': round(change, 3),
            'percent_change': round(percent_change, 3),
            'long_name': long_name,
            'logo_url': logo_url,
            'last_updated': cached.last_updated.isoformat()
        }
    except Exception as e:
         return {
            "error": f"Failed to fetch stock price for {symbol}: {str(e)}"
        }
