/* ------------------------------
  FONT & THEME TOKENS
------------------------------ */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
 /* Core Palette - Based on your cream/sage design */
  --color-cream: #E2D9CA;
  --color-sage-light : #95A693;
   --color-sage-dark : #596C68;
    --color-charcoal: #413E45;
 --color-white: #FFFFFF;
 --color-dark-text: #262626; /* Darker text for high contrast on light BG */

 /* Semantic */
 --bg-body: var(--color-sage-dark); /* Background outside main content */
 --bg-container: var(--color-cream); /* Main content background */
 --text-primary: var(--color-dark-text);
 --text-secondary: var(--color-sage-dark);
 --text-inverse: var(--color-cream);

 /* UI */
 --card-bg: rgba(255, 255, 255, 0.6); /* Semi-transparent white for glass effect */
 --card-border: rgba(89, 108, 104, 0.2); /* Light, subtle border */
 --card-shadow: 0 4px 12px rgba(65, 62, 69, 0.08); /* Subtle shadow */
--nav-bg: var(--color-charcoal);

 /* Accent */
 --accent-primary: var(--color-sage-dark);
 --accent-secondary: var(--color-sage-light);
 /* Status */
 --status-positive: #10B981; /* Green */
 --status-negative: #EF4444; /* Red */
 --status-neutral: #F59E0B; /* Amber */
}

/* ------------------------------
  RESET & GLOBALS
------------------------------ */
*,
*::before,
*::after {
 box-sizing: border-box;
}

body {
   margin: 0;
 background-color: var(--bg-body);
 color: var(--text-primary);
 font-family: 'Inter', sans-serif;
 -webkit-font-smoothing: antialiased;
 overflow-x: hidden; /* Prevent horizontal scroll */

 /* Subtle texture background for the viewport */
 background-image: radial-gradient(rgba(65, 62, 69, 0.03) 1px, transparent 1px);
 background-size: 24px 24px;
}

/* ------------------------------
  LAYOUT
------------------------------ */
.dashboard-container {
 background-color: var(--bg-container);
 width: 100%;
 min-height: 100vh;
 padding: 1.5rem;
 max-width: 1500px; /* Constrain overall layout */
 margin: 0 auto;
}

/* 2-column layout */
.main-grid {
 display: grid;
 grid-template-columns: 1fr 340px; /* Matches your design image proportions */
 gap: 1.5rem;
}

@media (max-width: 1024px) {
 .main-grid {
  grid-template-columns: 1fr;
 }
}

header {
 width: 100%;
 text-align: center;
 margin-bottom: 2rem;
}
header h1 {
    color: var(--color-charcoal);
    font-size: 2.5rem;
    font-weight: 700;
}


/* ------------------------------
  NAVBAR
------------------------------ */
.navbar {
 width: 100%;
 margin: 0 auto 2rem auto;
 padding: 0.75rem 1.5rem;
 display: flex;
 justify-content: flex-start; /* Aligned to left for brand/logo */
 align-items: center;

 background: var(--nav-bg);
 border-radius: 12px;
 box-shadow: 0 10px 20px rgba(65, 62, 69, 0.15);
}

.brand {
 display: flex;
 align-items: center;
gap: 0.75rem;
 font-size: 1.25rem;
 font-weight: 600;
color: var(--color-cream);
 margin-right: 4rem; /* Space between brand and nav items */
}

.brand-icon {
 background: var(--color-cream);
 padding: 8px;
 border-radius: 50%; /* Circle */
 color: var(--color-charcoal);
 display: flex;
 align-items: center;
 justify-content: center;
}

.nav-actions {
 display: flex;
 gap: 0.5rem;
 /* No gap: 5rem, buttons are now padded correctly */
}

.nav-actions button {
 border: none;
 background: transparent;
 color: rgba(226, 217, 202, 0.7);
 padding: 0.5rem 1rem;
 border-radius: 8px;
 font-weight: 500;
 cursor: pointer;
 transition: 0.2s ease;
}

.nav-actions button:hover {
 color: var(--color-white);
}

.nav-actions button.active {
 background: var(--color-cream);
 color: var(--color-charcoal);
 font-weight: 600;
}


/* ------------------------------
  CARDS (GLASS)
------------------------------ */
.glass-card {
 background: var(--card-bg);
 border: 1px solid var(--card-border);
 border-radius: 12px;
 padding: 1.25rem;
 box-shadow: var(--card-shadow);
 display: flex;
 flex-direction: column;
 gap: 1rem;
}

.glass-card:hover {
 border-color: var(--color-sage-dark);
 box-shadow: 0 6px 16px rgba(65, 62, 69, 0.12);
}

/* ------------------------------
  STATS GRID
------------------------------ */
.stats-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Use auto-fit for better responsiveness */
 gap: 1.5rem;
 margin-bottom: 2rem;
}

.stat-label {
 font-size: 0.85rem;
 color: var(--text-secondary);
 text-transform: uppercase;
 margin-bottom: 0.5rem;
 font-weight: 600;
 letter-spacing: 0.04em;
 display: flex;
 align-items: center;
  gap: 0.5rem;
}

.stat-value {
 font-size: 1.75rem;
 font-weight: 700;
 color: var(--text-primary);
 display: flex;
 gap: 0.75rem;
 align-items: center;
}

/* Trend badges */
.trend-tag {
 font-size: 0.75rem; 
 padding: 4px 10px;
border-radius: 20px;
 font-weight: 600;
 display: flex;
 align-items: center;
 gap: 4px;
}

.trend-up {
 background: rgba(16, 185, 129, 0.15); /* light green background */
 color: var(--status-positive);
}

.trend-down {
 background: rgba(239, 68, 68, 0.15); /* light red background */
 color: var(--status-negative);
}

/* ------------------------------
  SELECT INPUTS
------------------------------ */
.cyber-select {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--card-border);
 background: rgba(255, 255, 255, 0.8); /* Less transparent for light BG */
 color: var(--text-primary);
 cursor: pointer;
 transition: 0.2s;
 font-size: 1rem;
 font-weight: 500;
}

.cyber-select:hover,
.cyber-select:focus {
  border-color: var(--color-sage-dark);
  outline: none;
}

/* ------------------------------
  CHART HEADER
------------------------------ */
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--card-border);
}

.chart-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-selector {
  background: var(--accent-secondary); /* Use a soft sage color */
  padding: 4px;
  border-radius: 8px;
  display: flex;
  gap: 4px;
}

.time-btn {
  background: transparent;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  color: var(--color-charcoal);
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.time-btn:hover {
  background: rgba(65, 62, 69, 0.1);
}

.time-btn.active {
  background: var(--color-charcoal);
  color: var(--color-cream);
}

/* ------------------------------
  CHART STYLES (Recharts)
------------------------------ */
/* Custom Tooltip Styles for the chart */
.recharts-default-tooltip {
  background: var(--color-charcoal) !important;
  border: 1px solid var(--color-sage-dark) !important;
  color: var(--color-cream) !important;
  padding: 12px !important;
  border-radius: 8px !important;
}
.recharts-default-tooltip p {
  color: var(--color-sage-light) !important;
}

/* ------------------------------
  METRICS
------------------------------ */
.metrics-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding-top: 1.7rem;
  border-top: 1px solid var(--card-border);
}

.metric-item {
  text-align: center;
}
.metric-item .stat-label {
  justify-content: center;
}


/* ------------------------------
  SENTIMENT
------------------------------ */
.gauge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0; /* Reduced margin */
}

.sentiment-score {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: -20px;
}

.sentiment-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--card-border);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.detail-row span:first-child {
  color: var(--text-secondary);
}

/* ------------------------------
  NEWS CARDS
------------------------------ */
.news-card {
  padding: 1rem; /* Reduced padding */
  background: var(--color-white); /* Solid white for better readability against the graph background */
  border-radius: 8px; /* Slightly smaller radius */
  border-left: 4px solid var(--accent-secondary);
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: 0.25s ease;
}

.news-card:hover {
  transform: none; /* Removed slide to match a more conservative design */
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.news-card.positive { border-left-color: var(--status-positive); }
.news-card.negative { border-left-color: var(--status-negative); }
.news-card.neutral { border-left-color: var(--status-neutral); }

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem; /* Increased slightly for readability */
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.03em;
}

/* Sidebar H3s */
.glass-card h3 {
  color: var(--text-primary);
  border-bottom: 1px solid var(--card-border);
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}
