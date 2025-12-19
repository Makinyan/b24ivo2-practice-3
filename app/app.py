from flask import Flask
import os
import redis

app = Flask(__name__)

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    decode_responses=True,
)

@app.route("/")
def index():
    visits = r.incr("visits")
    return f"<h1>👋 Привет из Docker Compose!</h1><p>Количество посещений: {visits}</p>"

@app.route("/health")
def health():
    try:
        r.ping()
        return {"status": "ok"}, 200
    except Exception as e:
        return {"status": "error", "detail": str(e)}, 500
