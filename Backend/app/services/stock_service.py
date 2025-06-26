import yfinance as yf

def get_stock_price(symbol):
    try:
        stick = yf.Ticker(symbol)
        data = stick.history(period="1d")
        price = float(data['Close'].iloc[-1])
        return {
            "symbol": symbol,
            "price": price
        }
    except Exception as e:
        return {
            "error",
            f"Failed to fetch stock price for {symbol}: {str(e)}"
        }