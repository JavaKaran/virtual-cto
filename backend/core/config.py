import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    ACCESS_TOKEN_EXPIRE_HOURS: int = os.getenv("ACCESS_TOKEN_EXPIRE_HOURS", 24)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret_key")

settings = Settings()