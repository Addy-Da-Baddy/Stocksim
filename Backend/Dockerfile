FROM python:3.11-slim

WORKDIR /app

# Copy dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
ENV FLASK_APP=app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app:create_app()"]
