from datetime import datetime, time
import pytz

def is_market_open(user_timezone: str):
    try:
        tz = pytz.timezone(user_timezone)
    except pytz.UnknownTimeZoneError:
        return {'error': 'Invalid timezone'}, 400
    now = datetime.now(tz)
    if now.weekday() >= 5:  # Saturday or Sunday
        return {'market_open': False, 'local_time' : now.isoformat()}, 200
    market_open = time(9, 30)  # Market opens at 9:
    market_close = time(16, 0)  # Market closes at 16:00

    open_status = market_open <= now.time() <= market_close
    return {
        'market_open': open_status,
        'local_time': now.isoformat(),
        'day': now.strftime('%A'),
        'time': now.strftime('%H:%M:%S')
    }, 200