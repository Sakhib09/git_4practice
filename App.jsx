import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Newspaper, Brain, RefreshCw, Shield, BarChart3, Wallet, Zap, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import "./App.css"; 

// --- Configuration ---
const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', color: '#14F195' }
];

// --- Utilities ---
const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);

// Custom Tooltip must be adjusted to use the CSS-defined styles
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="recharts-default-tooltip">
        <p style={{ fontSize: '12px', marginBottom: '8px' }}>{label}</p>
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

// Brand Component for Navbar
const Brand = () => (
    <div className="brand">
        <div className="brand-icon"><Brain size={20} /></div>
        <span>AI Crypto Predictor</span>
    </div>
);


export default function CryptoDashboard() {
  const [selectedCoin, setSelectedCoin] = useState(COINS[0]);
  const [timeframe, setTimeframe] = useState('30');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for Backend Data
  const [historyData, setHistoryData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(12345.67); // Default mock
  const [sentimentScore, setSentimentScore] = useState(65); // Default mock
  const [sentimentData, setSentimentData] = useState({ label: 'Slightly Bullish', twitter_vol: '12%', reddit_growth: '+3.5%', whale_flow: 'Inflow' });
  const [news, setNews] = useState([ // Mock Data for visual consistency
      {id: 1, title: "Major exchange lists new token; market reacting.", source: "CoinDesk", time: "1hr ago", sentiment: "positive"},
      {id: 2, title: "Federal regulator announces new crypto hearing.", source: "Reuters", time: "3hr ago", sentiment: "neutral"},
      {id: 3, title: "Large volume liquidation event detected.", source: "WhaleAlert", time: "5hr ago", sentiment: "negative"},
  ]);
  const [metrics, setMetrics] = useState({ rmse: 120.5, mae: 85.2, accuracy: '85.2%', volume_24h: 3450000000, market_cap: 875000000000 });
  const [activeTab, setActiveTab] = useState('Dashboard');


// --- Price Change Calculation (Kept clean) ---
const priceChangePercentage = useMemo(() => {
  if (!historyData || historyData.length < 2) return 0;
  const lastHist = historyData[historyData.length - 1];
  const prevHist = historyData[historyData.length - 2];
  if (!lastHist || !prevHist || lastHist.price == null || prevHist.price == null) return 0;
  return ((lastHist.price - prevHist.price) / prevHist.price * 100).toFixed(2);
}, [historyData]);


  // --- Data Fetching (Kept async/await structure) ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Using mock data for reliable visual rendering if API is down
        const mockHistory = Array.from({ length: 30 }, (_, i) => ({
            date: `Day ${i + 1}`,
            price: currentPrice * (1 + (Math.sin(i / 10) * 0.1 + Math.random() * 0.05)),
        }));
        const mockPrediction = Array.from({ length: 7 }, (_, i) => ({
            date: `Pred ${i + 1}`,
            price: mockHistory[mockHistory.length - 1].price * (1 + (i / 100)),
        }));
        
        setHistoryData(mockHistory);
        setPredictionData(mockPrediction);
        
        // **Actual API Calls (uncomment when backend is ready)**
        /*         const marketRes = await fetch(`http://localhost:8000/api/market/${selectedCoin.id}?timeframe=${timeframe}`);
        if (!marketRes.ok) throw new Error("Failed to connect to Backend API");
        const marketJson = await marketRes.json();

        setHistoryData(marketJson.history);
        setPredictionData(marketJson.prediction);
        setCurrentPrice(marketJson.current_price);
        setMetrics(marketJson.metrics);

        const sentimentRes = await fetch('http://localhost:8000/api/sentiment');
        const sentimentJson = await sentimentRes.json();
        setSentimentScore(sentimentJson.score);
        setSentimentData(sentimentJson);

        const newsRes = await fetch('http://localhost:8000/api/news');
        const newsJson = await newsRes.json();
        setNews(newsJson);
        */

      } catch (err) {
        console.error("API Error:", err);
        setError("Ensure Backend is running on port 8000. Displaying mock data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCoin, timeframe]);

// --- Chart Data Combination ---
  const chartData = useMemo(() => {
    if (historyData.length > 0 && predictionData.length > 0) {
      const lastHist = historyData[historyData.length - 1];
      // Append the first prediction point to history to bridge the gap on the chart
      const historyWithBridge = [...historyData, { ...lastHist, isPrediction: true }]; 
      
      // Mark prediction data for different styling (e.g., dashed line)
      const predictionWithMark = predictionData.map(d => ({ ...d, isPrediction: true }));

      return [historyWithBridge, predictionWithMark];
    }
    return [historyData, []];
  }, [historyData, predictionData]);

// --- Sentiment Color Logic ---
  const getSentimentColor = (score) => score > 70 ? '#10b981' : score < 40 ? '#ef4444' : '#f59e0b';
const getSentimentLabel = (score) => score >= 75 ? 'Strong Bullish' : score >= 55 ? 'Bullish' : score >= 45 ? 'Neutral' : score >= 25 ? 'Bearish' : 'Strong Bearish';


  return (
    <>
      {/* Removed <style>{styles}</style> as styles are now in App.css */}
      <div className="dashboard-container">
        <header>
          <h1>AI Crypto Price Prediction</h1>
        </header>

        {/* Navbar */}
        <nav className="navbar">
          <Brand /> {/* Added Brand component */}
          <div className="nav-actions">
            {/* Reordered and cleaned up nav buttons */}
            {['Dashboard', 'News', 'Services', 'About', 'Contact', 'Login'].map(tab => (
              <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {error && (
          <div style={{ background: '#ef444420', color: '#ef4444', padding: '10px', margin: '0 0 2rem 0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ef444450' }}>
            <AlertTriangle size={20} /> 
            <div>
              <b>Connection Warning:</b> {error}
            </div>
          </div>
        )}

        {/* Top Stats Grid - Matched Image Layout */}
        <div className="stats-grid">
          {/* Asset Selection */}
          <div className="glass-card">
            <span className="stat-label"><Wallet size={14}/> Active Asset</span>
            <select className="cyber-select" value={selectedCoin.id} onChange={(e) => setSelectedCoin(COINS.find(c => c.id === e.target.value))}>
              {COINS.map(coin => <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>)}
            </select>
          </div>

          {/* Current Price */}
          <div className="glass-card">
            <span className="stat-label">Current Price</span>
            <div className="stat-value">
              {formatCurrency(currentPrice)}
              <span 
                className={`trend-tag ${priceChangePercentage >= 0 ? 'trend-up' : 'trend-down'}`}
                style={{
                  color: priceChangePercentage >= 0 ? 'var(--status-positive)' : 'var(--status-negative)',
                  backgroundColor: priceChangePercentage >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
                }}
              >
                {priceChangePercentage >= 0 ? <ArrowUp size={14}/> : <ArrowDown size={14}/>} {Math.abs(priceChangePercentage) || 0}%
              </span>
            </div>
          </div>

          {/* Prediction Accuracy */}
          <div className="glass-card">
            <span className="stat-label">Prediction Accuracy</span>
            <div className="stat-value">
              <span style={{color: 'var(--status-positive)'}}>{metrics.accuracy}</span>
              {/* Progress bar visualizer */}
              <div style={{ height: 8, width: 100, background: 'var(--card-border)', borderRadius: 10, marginLeft: 10 }}>
                <div style={{ 
                    height: '100%', 
                    width: metrics.accuracy, 
                    background: 'var(--status-positive)', 
                    borderRadius: 10 
                  }}></div>
              </div>
            </div>
          </div>

          {/* 24h Trading Volume */}
          <div className="glass-card">
            <span className="stat-label">24h Volume</span>
            <div className="stat-value" style={{color: 'var(--color-sage-dark)'}}>
              {formatCurrency(metrics.volume_24h)}
            </div>
          </div>

          {/* Market Cap */}
          <div className="glass-card">
            <span className="stat-label">Market Cap</span>
            <div className="stat-value" style={{color: 'var(--color-sage-dark)'}}>
              {formatCurrency(metrics.market_cap)}
            </div>
          </div>
          
          {/* Trend */}
          <div className="glass-card">
            <span className="stat-label">Next Target</span>
            <div className="stat-value">
              <span style={{color: 'var(--status-positive)'}}>
                {predictionData.length > 0 ? formatCurrency(predictionData[predictionData.length-1].price) : '...'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-grid">
          
          {/* Left: Chart Section */}
          <div className="glass-card" style={{minHeight: '500px', display: 'flex', flexDirection: 'column'}}>
            <div className="chart-header">
              <h2>
                <Activity size={20} color="var(--color-charcoal)"/> Price Prediction
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
                <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)'}}>
                  <RefreshCw className="animate-spin" size={40} color="var(--color-sage-dark)"/>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[0].concat(chartData[1])} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={selectedCoin.color} stopOpacity={0.6}/>
                        <stop offset="95%" stopColor={selectedCoin.color} stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" tick={{fontSize: 11, fill: 'var(--text-secondary)'}} minTickGap={30} />
                    <YAxis stroke="var(--text-secondary)" tick={{fontSize: 11, fill: 'var(--text-secondary)'}} domain={['auto', 'auto']} tickFormatter={(val) => `$${val.toLocaleString()}`} />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Historical Data */}
                    <Area 
                      name="Historical Price"
                      type="monotone" 
                      dataKey="price" 
                      stroke={selectedCoin.color} 
                      fill="url(#colorHistorical)" 
                      strokeWidth={2}
                      data={chartData[0].filter(d => !d.isPrediction)}
                    />
                    
                    {/* Prediction Data - Dashed Line */}
                    <Area 
                      name="AI Prediction"
                      type="monotone" 
                      dataKey="price" 
                      stroke="#06b6d4" 
                      fill="url(#colorPrediction)" 
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
                <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>{metrics.rmse}</div>
              </div>
              <div className="metric-item">
                <div className="stat-label"><BarChart3 size={14}/> MAE</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)'}}>{metrics.mae}</div>
              </div>
              <div className="metric-item">
                <div className="stat-label"><Shield size={14}/> Accuracy</div>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--status-positive)'}}>{metrics.accuracy}</div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Sentiment Gauge */}
            <div className="glass-card">
              <h3>
                <Brain size={18} color="var(--color-charcoal)" /> Market Sentiment
              </h3>
              
              <div className="gauge-wrapper">
                {/* The Gauge Visual is a CSS/div hack and retains the logic */}
                <div style={{ width: 180, height: 90, background: 'var(--card-border)', borderRadius: '100px 100px 0 0', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ 
                    width: '100%', height: '100%', 
                    background: getSentimentColor(sentimentScore),
                    opacity: 0.3,
                    transformOrigin: 'bottom center',
                    transform: `rotate(${(sentimentScore / 100) * 180 - 180}deg)`,
                    transition: 'transform 1s ease'
                  }} />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '10px', background: 'var(--card-bg)'
                  }}/>
                </div>
                <div className="sentiment-score">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getSentimentColor(sentimentScore) }}>{sentimentScore}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{getSentimentLabel(sentimentScore)}</div>
                </div>
              </div>

              <div className="sentiment-details">
                <div className="detail-row">
                  <span>Twitter Vol</span>
                  <span>{sentimentData.twitter_vol}</span>
                </div>
                <div className="detail-row">
                  <span>Reddit Growth</span>
                  <span style={{color: 'var(--status-positive)'}}>{sentimentData.reddit_growth}</span>
                </div>
                <div className="detail-row">
                  <span>Whale Flows</span>
                  <span style={{color: sentimentData.whale_flow === 'Inflow' ? 'var(--status-positive)' : 'var(--status-negative)'}}>{sentimentData.whale_flow}</span>
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div className="glass-card" style={{ flex: 1 }}>
              <h3>
                <Newspaper size={18} color="var(--color-charcoal)" /> Latest Signals
              </h3>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                {news.length === 0 ? (
                  <div style={{padding: 20, textAlign: 'center', color: 'var(--text-secondary)'}}>
                    {loading ? 'Analyzing signals...' : 'No signals detected'}
                  </div>
                ) : news.map(item => (
                  <div key={item.id} className={`news-card ${item.sentiment}`}>
                    <div className="news-meta">
                      <span>{item.source}</span>
                      <span>{item.time}</span>
                    </div>
                    <div style={{fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text-primary)'}}>{item.title}</div>
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