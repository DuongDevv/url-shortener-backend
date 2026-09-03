# 🚀 Enterprise URL Shortener Backend

High-Performance & Scalable URL Shortener System built with Node.js, TypeScript, PostgreSQL, Base62 Encoding Algorithm, and Docker.

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL 16 (With B-Tree Unique Indexing & Connection Pooling)
- **Algorithm:** Base62 Encoding ($O(\log_{62} N)$ complexity - Zero Hash Collision)
- **DevOps:** Docker, Multi-stage Dockerfile, Docker Compose
- **Security:** Helmet.js, CORS, Environment Isolation

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 20
- Docker & Docker Compose

### 2. Infrastructure Setup (Database)
```bash
# Spin up PostgreSQL via Docker
docker run --name postgres-shortener \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=123123 \
  -e POSTGRES_DB=url_shortener_db \
  -p 5444:5432 -d postgres:16-alpine
```

### 3. Application Setup
```bash
# Clone Repository
git clone https://github.com/DuongDevv/url-shortener-backend.git
cd url-shortener-backend

# Install Dependencies
npm install

# Setup Environment Variables
cp .env.example .env

# Run Development Server
npm run dev
```

---

## 🔌 API Endpoints Specifications

### 1. Create Short URL
- **POST** `/api/v1/urls`
- **Request Body:**
```json
{
  "long_url": "https://google.com",
  "custom_alias": "my-google"
}
```

### 2. Redirect Engine
- **GET** `/:shortKey`
- **Response:** `302 Found` (Redirects to long URL)

---

## 📄 License
Licensed under the ISCLicense.
