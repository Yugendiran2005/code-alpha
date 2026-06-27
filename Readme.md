# Smart Object Detection System — How to Run

---

## Option 1: Frontend Only (2 min — No Backend Needed)

```bash
npm install
npm run dev
```

Open **http://localhost:3000**  
Login: `demo@example.com` / `demo123`

Everything works with mock data. No Python or MySQL required.

---

## Option 2: Full Stack (Frontend + Backend + MySQL)

### Prerequisites

- Node.js 18+
- Python 3.8+
- MySQL 8.0+

---

### 1. Database

```bash
mysql -u root -p < DATABASE_SCHEMA.sql
```

---

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows

pip install -r requirements.txt
cp .env.example .env

# Edit .env — set your MySQL password:
# DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/detection_db
# SECRET_KEY=any-random-string

python main.py
```

Backend runs at **http://localhost:8000**  
API docs at **http://localhost:8000/docs**

---

### 3. Frontend

Open a **new terminal**:

```bash
npm install
npm run dev
```

Frontend at **http://localhost:3000**

---

## Login

| Email | Password |
|-------|----------|
| demo@example.com | demo123 |
| admin@detection.com | admin123 |

---

## Useful Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build

# Backend
python main.py       # Start backend
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| Port 8000 in use | Change `PORT` in `backend/.env` |
| MySQL connection failed | Check MySQL is running |
| Module not found | `pip install -r requirements.txt` |
| npm errors | `rm -rf node_modules && npm install` |
