# 📈 Stock Market Analyzer

A production-ready, full-stack stock market analysis platform built with **React**, **Node.js**, **MongoDB**, and the **Alpha Vantage API**.

## ✨ Features

### Core
- **Real-time Stock Data** — Search, view quotes, and explore company overviews
- **Interactive Charts** — Line/Area charts with zoom, pan, and crosshair
- **Technical Indicators** — SMA, EMA, RSI, MACD, Bollinger Bands, Golden/Death Cross
- **Portfolio Tracking** — Add investments, track P/L, and view allocation charts
- **Watchlist** — Save, pin, and monitor your favorite stocks
- **Market News** — Financial news feed with sentiment analysis
- **Market Overview** — Top gainers, losers, and most active stocks

### Authentication
- JWT-based signup/login/logout
- Forgot & reset password (with email)
- Remember me / persistent sessions
- Protected routes

### Design
- Dark glassmorphism theme inspired by TradingView
- Framer Motion animations throughout
- Fully responsive (mobile → desktop)
- Loading skeletons, error states, retry buttons

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS 3, React Router, React Query, Chart.js, Framer Motion, React Hook Form, React Icons |
| **Backend** | Node.js, Express, JWT, bcrypt, Helmet, CORS, Morgan, Express Validator |
| **Database** | MongoDB (Mongoose ODM) |
| **API** | Alpha Vantage |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## 📁 Project Structure

```
Stock_market_analyser/
├── backend/
│   ├── config/           # DB connection, cache config
│   ├── controllers/      # Route handlers (auth, stocks, portfolio, etc.)
│   ├── middleware/        # Auth, validation, rate limiting, error handling
│   ├── models/           # Mongoose schemas (User, Watchlist, Portfolio, etc.)
│   ├── routes/           # Express route definitions
│   ├── utils/            # Alpha Vantage service, email, JWT helpers
│   ├── server.js         # Express app entry point
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components (charts, common)
│   │   ├── config/       # Axios & React Query setup
│   │   ├── context/      # Auth & Theme context providers
│   │   ├── hooks/        # Custom hooks (useAuth, useDebounce, etc.)
│   │   ├── layouts/      # Main, Dashboard, Auth layouts
│   │   ├── pages/        # All page components
│   │   ├── services/     # API service wrappers
│   │   ├── utils/        # Formatters, constants
│   │   ├── App.jsx       # Router & route definitions
│   │   ├── main.jsx      # Entry point with providers
│   │   └── index.css     # Tailwind + custom styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Alpha Vantage API key ([get one free](https://www.alphavantage.co/support/#api-key))

### 1. Clone the repository
```bash
git clone <repo-url>
cd Stock_market_analyser
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env    # Edit with your values
npm install
npm run dev             # Starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env    # Edit VITE_API_URL if needed
npm install
npm run dev             # Starts on http://localhost:5173
```

### 4. Open in browser
Navigate to `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend (`.env`)
| Variable | Description | Example |
|----------|------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT signing | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `ALPHA_VANTAGE_API_KEY` | Alpha Vantage API key | `YOUR_KEY` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SMTP_HOST` | Email SMTP host | `smtp.gmail.com` |
| `SMTP_PORT` | Email SMTP port | `587` |
| `SMTP_USER` | Email address | `you@gmail.com` |
| `SMTP_PASS` | Email app password | `app-password` |

### Frontend (`.env`)
| Variable | Description | Example |
|----------|------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/logout` | Sign out |
| POST | `/api/auth/forgot-password` | Request reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get profile |
| PUT | `/api/user/profile` | Update profile |
| PUT | `/api/user/change-password` | Change password |
| DELETE | `/api/user/profile` | Delete account |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/search?q=AAPL` | Search stocks |
| GET | `/api/stocks/:symbol` | Get stock details |
| GET | `/api/stocks/historical/:symbol` | Get historical data |
| GET | `/api/stocks/indicators/:symbol` | Get technical indicators |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| PUT | `/api/watchlist/:id/pin` | Toggle pin |
| DELETE | `/api/watchlist/:id` | Remove from watchlist |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio` | Get portfolio |
| POST | `/api/portfolio` | Add investment |
| PUT | `/api/portfolio/:id` | Update investment |
| DELETE | `/api/portfolio/:id` | Delete investment |

### Market & News
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/market/overview` | Market overview |
| GET | `/api/market/gainers` | Top gainers |
| GET | `/api/market/losers` | Top losers |
| GET | `/api/market/active` | Most active |
| GET | `/api/news` | Financial news |

---

## 🚢 Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set root directory to `frontend`
4. Add env var: `VITE_API_URL` = your Render backend URL
5. Deploy

### Backend → Render
1. Push code to GitHub
2. Create a new Web Service in [Render](https://render.com)
3. Set root directory to `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add all env vars from `.env.example`
7. Deploy

### Database → MongoDB Atlas
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (or allow all: `0.0.0.0/0`)
4. Copy the connection string to `MONGO_URI`

---

## 🔒 Security

- Password hashing with bcrypt (12 salt rounds)
- JWT authentication with configurable expiry
- Helmet security headers
- CORS with whitelisted origin
- Rate limiting (200 req/15min general, 20/15min auth)
- Input validation & sanitization with express-validator
- No secrets in source code

---

## ⚡ Performance

- 5-minute API response caching (node-cache)
- React Query with 5-min stale time
- Code splitting with lazy-loaded routes
- Vite manual chunks (vendor, charts, motion)
- Debounced search input (400ms)
- Loading skeletons for perceived performance

---

## 📄 License

MIT

---

Built with ❤️ using React, Node.js, and the Alpha Vantage API.
