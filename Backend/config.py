from dotenv import load_dotenv
load_dotenv()
import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://simutrader:yourpassword@localhost/simutrade")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
