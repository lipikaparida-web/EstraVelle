import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import google.generativeai as genai
from dotenv import load_dotenv

# Load secrets from your perfectly placed .env file
load_dotenv()

app = FastAPI(title="EstraVelle Intelligence API")

# Security: Handshake with Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURATION & ERROR CATCHING ---
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    ai_model = genai.GenerativeModel('gemini-1.5-flash')
    supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
except Exception as e:
    print(f"CRITICAL ERROR: Please check your .env keys. Details: {e}")

# --- DATA MODELS (The Gatekeepers) ---
class LogEntry(BaseModel):
    user_id: str
    date: str
    symptoms: list = []
    cycle_length: int = 0
    mood: str = "neutral"
    flow: str = "medium"
    is_period_start: bool = False
    notes: str = ""


class UserMessage(BaseModel):
    uid: str
    message: str

# --- THE ML CORE (Prediction & PCOD Detection) ---
def run_wellness_ml(user_logs):
    df = pd.DataFrame(user_logs)
    if df.empty or len(df[df['is_period_start'] == True]) < 2:
        return None, "Low", 28 

    starts = pd.to_datetime(df[df['is_period_start'] == True]['logged_at']).sort_values()
    cycle_lengths = starts.diff().dt.days.dropna().tolist()
    
    avg_cycle = int(np.mean(cycle_lengths))
    std_dev = np.std(cycle_lengths)
    
    risk = "Low"
    if avg_cycle > 35 or std_dev > 7:
        risk = "Moderate"
    if avg_cycle > 45 or len(cycle_lengths) > 3 and any(g > 50 for g in cycle_lengths):
        risk = "High"

    next_date = starts.iloc[-1] + timedelta(days=avg_cycle)
    return next_date.date(), risk, avg_cycle

# --- ENDPOINTS (The Connections) ---

@app.get("/")
async def root():
    return {"status": "EstraVelle ML Engine is Online"}

# Route 1: The AI Chat Assistant
@app.post("/api/assistant")
async def wellness_guide(data: UserMessage):
    print(f"DEBUG: Received message from {data.uid}: {data.message}")
    try:
        # --- REAL AI INTEGRATION ---
        prompt = f"""You are "EstraVelle", a warm, empathetic virtual assistant doctor and health companion for women. You combine clinical knowledge with the heart of a supportive health coach. You specialize in hormonal health, PCOD/PCOS, and cycle-syncing.
Your Tone: Warm, patient, and reassuring with a clinical backbone. Non-judgmental. End with a grounding message of hope or a question about their well-being. Do not use markdown headers, just plain text with emojis.

User message: {data.message}"""
        
        try:
            response = ai_model.generate_content(prompt)
            bot_text = response.text
        except Exception as ai_err:
            print(f"Gemini API Error: {ai_err}")
            bot_text = "I'm having a little trouble connecting to my brain right now. Remember to listen to your body and rest if you need to! 💜"

        
        # Save to Supabase
        supabase.table("chat_history").insert({
            "user_id": data.uid,
            "message": data.message,
            "response": bot_text
        }).execute()
        
        return {"reply": bot_text}

    except Exception as e:
        print(f"!!! CRITICAL CHAT ERROR: {str(e)}")
        return {"reply": f"Technical Glitch: {str(e)}"}

# Route 2: Daily Health Logging & ML Trigger
@app.post("/api/log")
async def add_log_and_analyze(data: LogEntry):
    try:
        supabase.table("health_logs").insert({
            "user_id": data.user_id,
            "mood": data.mood,
            "symptoms": data.symptoms,
            "flow_intensity": data.flow,
            "is_period_start": data.is_period_start,
            "notes": data.notes
        }).execute()

        all_logs = supabase.table("health_logs").select("*").eq("user_id", data.user_id).execute()
        next_date, risk, avg_len = run_wellness_ml(all_logs.data)

        supabase.table("wellness_analytics").upsert({
            "user_id": data.user_id,
            "predicted_next_period": str(next_date) if next_date else None,
            "pcod_indicator_risk": risk,
            "avg_cycle_length": avg_len,
            "last_analyzed_at": datetime.now().isoformat()
        }).execute()

        return {"status": "success", "predicted_date": next_date}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Route 3: Fetch Data for Frontend Dashboards
@app.get("/api/insights/{uid}")
async def get_insights(uid: str):
    res = supabase.table("wellness_analytics").select("*").eq("user_id", uid).single().execute()
    return res.data

# --- End of Routes ---

if __name__ == "__main__":
    import uvicorn
    # "main:app" means: look in main.py for the FastAPI object named 'app'
    # host="0.0.0.0" allows the server to be accessible on your local network
    # reload=True automatically restarts the server when you save changes (great for dev)
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 