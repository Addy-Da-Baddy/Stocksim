from flask import Blueprint, jsonify,request
from app.services.stock_service import get_stock_price
import yfinance as yf
import pandas as pd
from prophet import Prophet

stock_bp = Blueprint('stock_bp', __name__)

@stock_bp.route('/stock/price/<symbol>', methods=['GET'])
def fetch_price(symbol):
    result = get_stock_price(symbol)
    return jsonify(result)

@stock_bp.route('/stock/history/<symbol>', methods=['GET'])
def fetch_history(symbol):
    symbol = symbol.upper()
    range = request.args.get('range', '1d')
    interval = request.args.get('interval', '1m')
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=range, interval=interval)
        if history.empty:
            return jsonify({'error': 'No data found for the symbol'}), 404
        history_list = [
            {"date": str(idx.date()), "open": float(row['Open']), "close": float(row['Close'])}
            for idx, row in history.iterrows()
        ]
        return jsonify({
            'symbol': symbol,
            'history': history_list,
            'interval': interval,
            'range': range
        }),200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch history for {symbol}: {str(e)}'}), 500

@stock_bp.route('/stock/forecast', methods=['GET'])
def fetch_forecast():
    symbol = request.args.get('symbol', '').upper()
    days = int(request.args.get('days', 7))

    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400

    try:
        ticker = yf.Ticker(symbol)
        history = ticker.history(period='1y', interval='1d')

        if history.empty:
            return jsonify({'error': 'No historical data found to generate forecast'}), 404

        df = history.reset_index()
        df = df.rename(columns={'Date': 'ds', 'Close': 'y'})
        df['ds'] = pd.to_datetime(df['ds']).dt.tz_localize(None)
        df = df[['ds', 'y']]

        model = Prophet()
        model.fit(df)

        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)

        return jsonify({
            'symbol': symbol,
            'forecast': forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].to_dict(orient='records')
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to generate forecast for {symbol}: {str(e)}'}), 500
