import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, Newspaper, Brain, RefreshCw, Shield, BarChart3, Bell, ChevronDown, Wallet, Zap, AlertTriangle } from 'lucide-react';
import "./App.css";
// --- Configuration ---
const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#14F195' }
];

// --- Utilities ---
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} style={{ fontSize: '14px', color: entry.stroke, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: entry.stroke}}></span>
            {entry.name}: {formatCurrency(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};


// --- Embedded CSS ---

const styles = `
  :root {
    --bg-dark: #0f172a;
    --card-bg: rgba(30, 41, 59, 0.7);
    --card-border: rgba(148, 163, 184, 0.1);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --accent-blue: #6366f1;
    --accent-cyan: #06b6d4;
    --accent-green: #10b981;
    --accent-red: #ef4444;
  }

  body {
    background-color: #E2D9CA;
    color: var(--text-primary);
    font-family: 'Inter', sans-serif;
    margin: 0;
    overflow-x: hidden;
  }

  .dashboard-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 1000vh;
  }

  /* Navbar *
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(12px);
    border-radius: 16px;
    border: 1px solid var(--card-border);
    margin-bottom: 1.5rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.25rem;
    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .brand-icon {
    background: var(--accent-blue);
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .nav-actions button {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .nav-actions button.active, .nav-actions button:hover {
    color: white;
    background: rgba(0, 255, 42, 0.61);
  }

  .btn-primary {
    background: var(--accent-blue) !important;
    color: white !important;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  /* Stats Grid *
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .glass-card {
    background: var(--card-bg);
    backdrop-filter: blur(12px);
    border: 1px solid var(--card-border);
    border-radius: 16px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .trend-tag {
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
  }

  .trend-up {
    background: rgba(16, 185, 129, 0.2);
    color: var(--accent-green);
  }

  .cyber-select {
    width: 100%;
    background: rgba(0,0,0,0.2);
    border: 1px solid var(--card-border);
    color: white;
    padding: 0.5rem;
    border-radius: 8px;
    outline: none;
    font-size: 1rem;
  }

  /* Main Grid * 
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    .main-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Chart Header *
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .time-selector {
    background: rgba(0,0,0,0.2);
    padding: 4px;
    border-radius: 8px;
    display: flex;
    gap: 4px;
  }

  .time-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
  }

  .time-btn.active {
    background: var(--card-border);
    color: white;
  }

  /* Metrics *
  .metrics-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--card-border);
  }

  .metric-item {
    text-align: center;
  }

  /* Sentiment *
  .gauge-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1.5rem 0;
  }

  .sentiment-score {
    text-align: center;
    margin-top: -40px;
    z-index: 10;
  }

  .sentiment-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  /* News *
  .news-card {
    padding: 1rem;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    margin-bottom: 0.75rem;
    border-left: 3px solid var(--card-border);
    transition: transform 0.2s;
  }
  
  .news-card:hover {
    transform: translateX(4px);
    background: rgba(255,255,255,0.04);
  }

  .news-card.positive { border-left-color: var(--accent-green); }
  .news-card.negative { border-left-color: var(--accent-red); }
  .news-card.neutral { border-left-color: #f59e0b; }

  .news-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;


export default function CryptoDashboard() {
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Backend Data
  const [historyData, setHistoryData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [sentimentScore, setSentimentScore] = useState(50);
  const [sentimentData, setSentimentData] = useState({ label: 'Neutral', twitter_vol: '-', reddit_growth: '-', whale_flow: '-' });
  const [news, setNews] = useState([]);
  const [metrics, setMetrics] = useState({ rmse: 0, mae: 0, accuracy: '0%' });
  
  const [activeTab, setActiveTab] = useState('dashboard');



  // --- Inside CryptoDashboard component ---
const priceChangePercentage = useMemo(() => {
  if (!historyData || historyData.length < 2) return 0;

  const lastHist = historyData[historyData.length - 1];
  const prevHist = historyData[historyData.length - 2];

  if (!lastHist || !prevHist || lastHist.price == null || prevHist.price == null) return 0;

  return ((lastHist.price - prevHist.price) / prevHist.price * 100).toFixed(2);
}, [historyData]);

  // Fetch Data from Python Backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Market Data & Predictions
        const marketRes = await fetch(`http://localhost:8000/api/market/${selectedCoin.id}?timeframe=${timeframe}`);
        if (!marketRes.ok) throw new Error("Failed to connect to Backend API");
        const marketJson = await marketRes.json();

        setHistoryData(marketJson.history);
        setPredictionData(marketJson.prediction);
        setCurrentPrice(marketJson.current_price);
        setMetrics(marketJson.metrics);

        // 2. Fetch Sentiment (Global)
        const sentimentRes = await fetch('http://localhost:8000/api/sentiment');
        const sentimentJson = await sentimentRes.json();
        setSentimentScore(sentimentJson.score);
        setSentimentData(sentimentJson);

        // 3. Fetch News
        const newsRes = await fetch('http://localhost:8000/api/news');
        const newsJson = await newsRes.json();
        setNews(newsJson);

      } catch (err) {
        console.error("API Error:", err);
        setError("Ensure Backend is running on port 8000");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCoin, timeframe]);

  const chartData = useMemo(() => {
    if (historyData.length > 0 && predictionData.length > 0) {
      const lastHist = historyData[historyData.length - 1];
      return [historyData, [{ ...lastHist, isPrediction: true }, ...predictionData]];
    }
    return [historyData, []];
  }, [historyData, predictionData]);

  const getSentimentColor = (score) => score > 70 ? '#10b981' : score < 40 ? '#ef4444' : '#f59e0b';

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-container">
        {/* Navbar */}
        <nav className="navbar" width="100%">
          <div className="brand">
            <div className="brand-icon"><Brain size={24} color="white" /></div>
            <span>Crypto Currency Price Prediction</span>
          </div>
          <div className="nav-actions">
            <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
            <button className={activeTab === 'news' ? 'active' : ''} onClick={() => setActiveTab('news')}>News</button>
            <button className="btn-primary"><Bell size={16} />Login</button>
          </div>
        </nav>

        {error && (
          <div style={{ background: '#ef444420', color: '#ef4444', padding: '10px', margin: '0 0 2rem 0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ef444450' }}>
            <AlertTriangle size={20} /> 
            <div>
              <b>Connection Error:</b> {error}. 
              <div style={{fontSize: '0.85rem', marginTop: '4px', opacity: 0.8}}>Run <code>uvicorn main:app --reload --port 8000</code> in your backend folder.</div>
            </div>
          </div>
        )}

        {/* Top Stats Grid */}
        <div className="stats-grid">
          <div className="glass-card">
            <span className="stat-label flex items-center gap-2"><Wallet size={14}/> Active Asset</span>
            <select className="cyber-select" value={selectedCoin.id} onChange={(e) => setSelectedCoin(COINS.find(c => c.id === e.target.value))}>
              {COINS.map(coin => <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>)}
            </select>
          </div>

    <div className="glass-card">
  <span className="stat-label">Current Price</span>
  <div className="stat-value">
    {formatCurrency(currentPrice)}
    <span 
      className={`trend-tag ${priceChangePercentage >= 0 ? 'trend-up' : 'trend-down'}`}
      style={{color: priceChangePercentage >= 0 ? '#10b981' : '#ef4444'}}
    >
      <TrendingUp size={14}/> {Math.abs(priceChangePercentage) || 0}%
    </span>
  </div>
</div>


          <div className="glass-card">
            <span className="stat-label">Prediction Accuracy</span>
            <div className="stat-value">
              <span style={{color: '#63f1e0ff'}}>{metrics.accuracy}</span>
              <div style={{ height: 6, width: 100, background: '#0069fbff', borderRadius: 10, marginLeft: 10 }}>
                <div style={{ height: '100%', width: '85%', background: '#6366f1', borderRadius: 10 }}></div>
              </div>
            </div>
          </div>

          <div className="glass-card">
            <span className="stat-label">Trends</span>
            <div className="stat-value">
              <span style={{color: '#06b6d4'}}>Bullish</span>
              <span style={{fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto'}}>
                  Tgt: {predictionData.length > 0 ? formatCurrency(predictionData[predictionData.length-1].price) : '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          
          {/* Left: Chart Section */}
          <div className="glass-card" style={{minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
            <div className="chart-header">
              <h2 style={{fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', margin: 0}}>
                <Activity className="text-indigo-400" size={20}/> Price prediction
              </h2>
              <div className="time-selector">
                {['7', '30', '90'].map(d => (
                  <button key={d} onClick={() => setTimeframe(d)} className={`time-btn ${timeframe === d ? 'active' : ''}`}>
                    {d}D
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, minHeight: 350 }}>
              {loading ? (
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <RefreshCw className="animate-spin" size={40} color="#6366f1"/>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData.flat()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedCoin.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={selectedCoin.color} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 11}} minTickGap={30} />
                    <YAxis stroke="#64748b" tick={{fontSize: 11}} domain={['auto', 'auto']} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    <Area 
                      name="Historical"
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedCoin.color} 
                      fill="url(#colorPrice)" 
                      strokeWidth={2}
                      data={chartData[0].map(d => ({...d, price: d.isPrediction ? null : d.price}))}
                    />
                    <Area 
                      name="AI Prediction"
                      type="monotone" 
                      dataKey="price" 
                      stroke="#06b6d4" 
                      fill="url(#colorPred)" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      data={chartData[1]}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Model Metrics */}
            <div className="metrics-container">
              <div className="metric-item">
                <div className="stat-label"><Zap size={14}/> RMSE Error</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{metrics.rmse}</div>
              </div>
              <div className="metric-item">
                <div className="stat-label"><BarChart3 size={14}/> MAE</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{metrics.mae}</div>
              </div>
              <div className="metric-item">
                <div className="stat-label"><Shield size={14}/> Accuracy</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#10b981'}}>{metrics.accuracy}</div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Sentiment Gauge */}
            <div className="glass-card">
              <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', margin: 0, paddingBottom: '1rem'}}>
                <Brain size={18} color="#f43f5e" /> Market Sentiment
              </h3>
              
              <div className="gauge-wrapper">
                <div style={{ width: 180, height: 90, background: '#1e293b', borderRadius: '100px 100px 0 0', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ 
                    width: '100%', height: '100%', 
                    background: getSentimentColor(sentimentScore),
                    opacity: 0.2,
                    transformOrigin: 'bottom center',
                    transform: `rotate(${(sentimentScore / 100) * 180 - 180}deg)`,
                    transition: 'transform 1s ease'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10px', background: '#0f172a'
                  }}/>
                </div>
                <div className="sentiment-score">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getSentimentColor(sentimentScore) }}>{sentimentScore}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{sentimentData.label}</div>
                </div>
              </div>

              <div className="sentiment-details">
                <div className="detail-row">
                  <span style={{color: '#94a3b8'}}>Twitter Vol</span>
                  <span>{sentimentData.twitter_vol}</span>
                </div>
                <div className="detail-row">
                  <span style={{color: '#94a3b8'}}>Reddit</span>
                  <span style={{color: '#10b981'}}>{sentimentData.reddit_growth}</span>
                </div>
                <div className="detail-row">
                  <span style={{color: '#94a3b8'}}>Whale Flows</span>
                  <span style={{color: sentimentData.whale_flow === 'Inflow' ? '#10b981' : '#ef4444'}}>{sentimentData.whale_flow}</span>
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div className="glass-card" style={{ flex: 1 }}>
              <h3 style={{marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'white', margin: 0, paddingBottom: '1rem'}}>
                <Newspaper size={18} color="#f59e0b" /> Latest Signals
              </h3>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {news.length === 0 ? (
                  <div style={{padding: 20, textAlign: 'center', color: '#64748b'}}>
                    {loading ? 'Analyzing signals...' : 'No signals detected'}
                  </div>
                ) : news.map(item => (
                  <div key={item.id} className={`news-card ${item.sentiment}`}>
                    <div className="news-meta">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <div style={{fontSize: '0.9rem', lineHeight: '1.4'}}>{item.title}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}




