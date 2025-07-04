# Stocksim: A Virtual Stock Trading Platform

Stocksim is a full-stack web application that allows users to practice stock trading in a simulated, real-time environment. It provides a safe and realistic platform for users to learn about the stock market, test trading strategies, and compete with other users without any financial risk.

**Live Application:** [stocksim-dusky.vercel.app](https://stocksim-dusky.vercel.app/)

## Key Features

*   **User Authentication:** Secure user registration and login system.
*   **Real-Time Stock Data:** Fetches and displays up-to-date stock prices and market data.
*   **Portfolio Management:** Users get a starting virtual balance to buy and sell stocks, and can track their portfolio's performance over time.
*   **Stock Trading:** A realistic trading interface to buy and sell stocks based on live market data.
*   **Financial News:** Integrated news feed to help users make informed trading decisions.
*   **Leaderboard:** A competitive leaderboard that ranks users based on their portfolio performance.
*   **Community Features:** A community shop where users can spend their virtual earnings.
*   **Educational Content:** Articles and resources to help users learn about stock trading.

## Tech Stack

### Frontend

*   **Framework:** React (with Vite)
*   **Routing:** React Router
*   **API Communication:** Axios
*   **Styling:** CSS (with Framer Motion for animations)
*   **Charting:** Recharts & Lightweight Charts

### Backend

*   **Framework:** Flask
*   **Server:** Gunicorn
*   **Authentication:** JWT (JSON Web Tokens)

### Database

*   **Database:** MariaDB (MySQL compatible)

## Deployment

*   **Frontend:** Deployed on [Vercel](https://vercel.com/). The live version is automatically updated on every push to the `main` branch.
*   **Backend:** Deployed on [Railway](https://railway.app/).
*   **Database:** Hosted on [Railway](https://railway.app/).

## Local Development

To run this project on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/Addy-Da-Baddy/Stocksim.git
cd Stocksim
```

### 2. Set Up the Backend

*   Navigate to the `Backend` directory.
*   Create a virtual environment and install the required Python packages.
*   Create a `.env` file and add the necessary environment variables (`DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, `NEWS_API_KEY`).
*   Run the Flask application.

### 3. Set Up the Frontend

*   Navigate to the `Frontend` directory.
*   Install the required Node.js packages.
*   Create a `.env` file with `VITE_API_URL` pointing to your local backend.
*   Start the Vite development server.

## Author

*   **Addy** - [Addy-Da-Baddy](https://github.com/Addy-Da-Baddy)
