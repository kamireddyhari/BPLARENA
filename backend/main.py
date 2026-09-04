from fastapi import FastAPI, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import httpx
from dotenv import load_dotenv
import random
import string

load_dotenv()

app = FastAPI(title="BPL Arena API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Lead(BaseModel):
    name: str
    phone: str
    service: str

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")

def load_json(filename: str):
    filepath = os.path.join(DATA_DIR, filename)
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_json_atomic(filename: str, data):
    """Write JSON atomically: write to temp file, then rename. Prevents corruption on server reload."""
    filepath = os.path.join(DATA_DIR, filename)
    tmp_path = filepath + ".tmp"
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp_path, filepath)  # Atomic on all platforms

def generate_lead_id():
    chars = string.digits
    random_str = ''.join(random.choice(chars) for _ in range(4))
    return f"BPL-{random_str}"

async def send_to_google_sheets(lead_id: str, name: str, phone: str, service: str):
    sheets_webhook = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL")
    if sheets_webhook:
        payload = {
            "lead_id": lead_id,
            "name": name,
            "phone": phone,
            "service": service
        }
        async with httpx.AsyncClient() as client:
            try:
                await client.post(sheets_webhook, json=payload, timeout=10.0, follow_redirects=True)
                print(f"Lead {lead_id} saved to Google Sheets ✅")
            except Exception as e:
                print(f"Failed to send to Google Sheets: {e}")

async def send_to_telegram(lead_id: str, name: str, phone: str, service: str):
    bot_token = os.getenv("TELEGRAM_BOT_TOKEN")
    chat_id = os.getenv("TELEGRAM_CHAT_ID")
    if bot_token and chat_id:
        message = f"🔔 New Lead Alert!%0A%0AID: {lead_id}%0AName: {name}%0APhone: {phone}%0AService: {service}"
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage?chat_id={chat_id}&text={message}"
        async with httpx.AsyncClient() as client:
            try:
                await client.get(url, timeout=10.0)
            except Exception as e:
                print(f"Failed to send Telegram alert: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to BPL Arena API"}

@app.get("/api/trivia")
def get_trivia():
    return load_json("trivia.json")

@app.get("/api/rates")
def get_rates():
    return load_json("rates.json")

@app.get("/api/banks")
def get_banks():
    return load_json("banks.json")

from typing import List, Any

@app.post("/api/banks")
async def save_banks(data: List[Any]):
    save_json_atomic("banks.json", data)
    return {"status": "success", "message": "Banks data saved"}

@app.post("/api/leads")
async def create_lead(lead: Lead, background_tasks: BackgroundTasks):
    lead_id = generate_lead_id()
    print(f"New Lead: {lead_id} - {lead}")

    # Fire-and-forget: Google Sheets + Telegram run in background
    # API returns INSTANTLY without waiting for them
    background_tasks.add_task(send_to_google_sheets, lead_id, lead.name, lead.phone, lead.service)
    background_tasks.add_task(send_to_telegram, lead_id, lead.name, lead.phone, lead.service)

    # No backend WhatsApp needed. Frontend does Click-to-Chat redirect.
    return {"status": "success", "lead_id": lead_id, "message": "Lead received"}
