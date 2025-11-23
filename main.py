import logging
import random
from typing import List, Optional
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import numpy as np

# --- Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NeuroCrypto AI Backend", version="1.0.0")

# Enable CORS for your React frontend


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allows frontend to access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class NewsItem(BaseModel):
    id: int
    title: str
    source: str
    sentiment: str
    time: str

class CoinData(BaseModel):
    id: str
    symbol: str
    name: str
    current_price: float
    price_change_percentage_24h: float

class PredictionPoint(BaseModel):
    date: str
    price: float
    isPrediction: bool = True

class SentimentData(BaseModel):
    score: int
    label: str
    twitter_vol: str
    reddit_growth: str
    whale_flow: str

# --- Mock Data Stores ---
# In a real app, these would come from a Database or Live Feed
NEWS_DB = [
    {"id": 1, "title": "SEC Approves New Crypto Regulations", "source": "CryptoDaily", "sentiment": "neutral", "time": "2h ago"},
    {"id": 2, "title": "Institutional Inflows Hit Record Highs", "source": "FinanceWeek", "sentiment": "positive", "time": "4h ago"},
    {"id": 3, "title": "Network Congestion Causes Fee Spike", "source": "TechBlock", "sentiment": "negative", "time": "6h ago"},
    {"id": 4, "title": "Major Partnership Announced for DeFi Protocol", "source": "CoinLedger", "sentiment": "positive", "time": "12h ago"},
    {"id": 5, "title": "AI Token Sector Sees 300% Growth", "source": "AI Insider", "sentiment": "positive", "time": "14h ago"},
]

# --- Helper Functions ---

def calculate_lstm_prediction(history_prices: List[float], steps: int = 7) -> List[float]:
    """
    Simulates an LSTM projection. 
    In a production environment, you would load a .h5 or .pt model file here
    and run inference using tensorflow or torch.
    """
    if not history_prices:
        return []
    
    last_price = history_prices[-1]
    predictions = []
    current_price = last_price
    
    # Simulating volatility based on recent variance
    recent_volatility = np.std(history_prices[-30:]) / np.mean(history_prices[-30:]) if len(history_prices) > 30 else 0.05
    
    for i in range(steps):
        # Random Walk with drift (simulating model uncertainty)
        drift = 0.001  # Slight bullish bias for the demo
        shock = np.random.normal(0, recent_volatility)
        change = current_price * (drift + shock)
        current_price += change
        predictions.append(current_price)
        
    return predictions

# --- API Endpoints ---

@app.get("/")
async def root():
    return {"message": "NeuroCrypto AI API is running"}

@app.get("/api/news", response_model=List[NewsItem])
async def get_news():
    """Returns the latest AI-curated news signals."""
    return NEWS_DB

@app.get("/api/sentiment", response_model=SentimentData)
async def get_sentiment():
    """
    Returns aggregated market sentiment. 
    Real implementation would scrape Twitter/Reddit APIs.
    """
    score = random.randint(40, 85)
    
    # Determine label
    if score > 70:
        label = "Extreme Greed"
    elif score < 40:
        label = "Extreme Fear"
    else:
        label = "Neutral"
        
    return {
        "score": score,
        "label": label,
        "twitter_vol": "High (24K)",
        "reddit_growth": "+12%",
        "whale_flow": "Outflow" if score < 50 else "Inflow"
    }

@app.get("/api/market/{coin_id}")
async def get_market_data(coin_id: str, timeframe: str = "30"):
    """
    Proxies CoinGecko data and appends AI predictions.
    This protects your frontend from API key exposure and rate limits.
    """
    try:
        # Proxy call to CoinGecko
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart",
                params={
                    "vs_currency": "usd",
                    "days": timeframe,
                    "interval": "daily"
                },
                timeout=10.0
            )
            response.raise_for_status()
            data = response.json()
            
        prices = data.get("prices", [])
        
        if not prices:
            raise HTTPException(status_code=404, detail="No price data found")

        # Format Historical Data
        formatted_history = []
        price_values = []
        
        for timestamp, price in prices:
            date_str = datetime.fromtimestamp(timestamp / 1000).strftime('%b %d')
            formatted_history.append({
                "date": date_str,
                "price": price,
                "isPrediction": False
            })
            price_values.append(price)

        # Generate "AI" Predictions
        prediction_values = calculate_lstm_prediction(price_values)
        
        formatted_predictions = []
        last_date = datetime.now()
        
        for i, pred_price in enumerate(prediction_values):
            next_date = last_date + timedelta(days=i + 1)
            formatted_predictions.append({
                "date": next_date.strftime('%b %d'),
                "price": pred_price,
                "isPrediction": True
            })

        # Calculate Mock Accuracy Metrics based on volatility
        rmse = np.std(price_values) * 0.15
        mae = np.mean(np.abs(np.diff(price_values))) * 5
        
        return {
            "history": formatted_history,
            "prediction": formatted_predictions,
            "current_price": price_values[-1],
            "metrics": {
                "rmse": round(rmse, 2),
                "mae": round(mae, 2),
                "accuracy": f"{random.uniform(88.5, 94.2):.1f}%"
            }
        }

    except httpx.RequestError as e:
        logger.error(f"External API Error: {e}")
        raise HTTPException(status_code=503, detail="Market data provider unavailable")
    except Exception as e:
        logger.error(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")