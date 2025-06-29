from datetime import datetime, time
import pytz

def is_market_open(user_timezone: str):
    try:
        tz = pytz.timezone(user_timezone)
    except pytz.UnknownTimeZoneError:
        return {'error': 'Invalid timezone'}, 400
    
    now = datetime.now(tz)
    market_open_time = time(9, 30)
    market_close_time = time(16, 0)

    is_weekend = now.weekday() >= 5  # Saturday or Sunday
    is_market_hours = market_open_time <= now.time() <= market_close_time

    open_status = is_market_hours and not is_weekend

    return {
        'market_open': open_status,
        'local_time': now.isoformat(),
        'day': now.strftime('%A'),
        'time': now.strftime('%H:%M:%S'),
        'timezone': user_timezone,
        'market_opens_at': market_open_time.strftime('%H:%M:%S'),
        'market_closes_at': market_close_time.strftime('%H:%M:%S')
    }, 200