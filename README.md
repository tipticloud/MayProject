# MayProject

Welcome to **MayProject** — a full-stack application with a robust backend and modern frontend.

## 🚀 Live Deployments

- **Frontend**: [https://frontend-umber-beta-97.vercel.app/](https://frontend-umber-beta-97.vercel.app/)
- **Backend API**: [https://mayproject-production.up.railway.app](https://mayproject-production.up.railway.app)

## 📋 Project Structure

This repository contains both the backend logic and configuration for MayProject. The frontend is deployed separately on Vercel and communicates with this backend API.

### Backend
- **Hosting**: Railway
- **URL**: https://mayproject-production.up.railway.app

### Frontend
- **Hosting**: Vercel
- **URL**: https://frontend-umber-beta-97.vercel.app/

## 🛠️ Technology Stack

### Backend
- Node.js / Express
- MongoDB (or your database)
- REST API endpoints
- Deployed on Railway

### Frontend
- React with Vite
- Modern UI/UX
- Tailwind CSS
- Deployed on Vercel

## 📦 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tipticloud/MayProject.git
cd MayProject
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Configure environment variables:
```bash
cp .env.example .env.local
```

5. Start the development server:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open http://localhost:5173 for the frontend.

## 🔗 API Integration

The frontend communicates with the backend API at:
```
https://mayproject-production.up.railway.app
```

Ensure your `.env` files are properly configured with the correct API endpoints.

## 📝 Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues or questions, please open a GitHub issue in this repository.

---

**Last Updated**: May 16, 2026
