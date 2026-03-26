# 🛡️ API Sentinel - AI-Powered Monitoring Dashboard

API Sentinel is an enterprise-grade API monitoring and logging platform. This repository contains the React.js frontend, featuring a modern "Midnight Glass" UI, real-time data visualization, and seamless AI integrations to help developers track system uptime, latency, and costs.

## Tech Stack & UI/UX
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS ("Midnight Glass" Theme with glassmorphism effects)
* **Data Visualization:** Recharts (Interactive glowing latency and volume graphs)
* **Routing & State:** React Router, Context API (for JWT Auth State)
* **Deployment:** Nginx on a remote Linux VPS

## Key Dashboard Features
1. **The "Bento Box" Grid:** A modern, responsive dashboard layout summarizing Total APIs, global uptime, and estimated monthly costs.
2. **Live Interactive Charts:** Custom tooltips and glowing Recharts lines showing Average Latency vs. p95 Latency under load.
3. **Real-Time Log Terminal:** A scrolling, terminal-style window rendering live HTTP ping logs (200 OK, 404, 500) directly in the browser.
4. **Role-Based Access Control (RBAC):** Secure UI routes ensuring User data isolation, alongside an Admin master view. 
5. **Smart Alerts Configuration:** UI forms to register Discord Webhook URLs for instant downtime notifications.
6. **Billing & Cost Estimator:** Visual tracking of API request volume mapped to custom "Cost per 1,000 requests" metrics.

## Local Development Setup

### Prerequisites
* Node.js (v16+)
* npm or yarn
