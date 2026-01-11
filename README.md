# ✨ Nexus Event Management System v2.0

A premium **B2B2C Event Management Marketplace** built with the MERN stack. This platform connects event organizers with verified vendors across multiple service categories.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-18%2B-brightgreen)
![React](https://img.shields.io/badge/react-18-61DAFB)

---

## 🚀 What's New in v2.0

### Complete UI Revamp
- **Glassmorphism Design** - Modern frosted glass aesthetic
- **Premium Dark Theme** - Consistent dark mode across all pages
- **Smooth Animations** - Fade-ins, slides, and micro-interactions
- **Mobile Responsive** - Works on all screen sizes

### Enhanced Features
- **6 Payment Methods** - UPI, Cards, Net Banking, Wallets, EMI, Cash on Delivery
- **Payment Simulation** - Realistic payment processing experience
- **Password Strength Meter** - Real-time validation on signup
- **Rate Limiting** - Protection against brute force attacks
- **Indian-themed Data** - Realistic vendor and product data

### Technical Improvements
- Better error handling throughout
- Improved authentication security
- Clickable logo navigation on all pages
- Proper 404 page instead of silent redirects

---

## 🎯 Features

### 👤 For Users (Event Organizers)
- Browse vendors by category (Catering, Florist, Decoration, Lighting)
- Add products to cart from multiple vendors
- Secure checkout with 6 payment options
- Real-time order tracking
- Guest list management

### 🏪 For Vendors (Service Providers)
- Product management dashboard
- Order/transaction history
- Product status tracking
- Membership status display

### 👑 For Admins
- User & vendor management
- Order status updates
- Vendor membership control
- Platform analytics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Images | Cloudinary |
| Styling | CSS (Premium Dark Theme) |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/yourusername/event-management-system.git
cd event-management-system

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5002
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Seed Database (Optional)

```bash
cd server
npm run seed
```

### 4. Start Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Open in Browser
- Frontend: http://localhost:5173
- Backend: http://localhost:5002

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@event.com | password123 |
| Vendor | vendor@event.com | password123 |
| User | user@event.com | password123 |

---

## 📁 Project Structure

```
Event Management System/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth & Cart context
│   │   ├── pages/          # All page components
│   │   ├── services/       # API service layer
│   │   └── index.css       # Global styles
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── config/             # DB & Cloudinary config
│   ├── middleware/         # Auth middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── seedData.js         # Database seeder
│   └── server.js           # Entry point
│
└── README.md
```

---

## 💳 Payment Methods

| Method | Description |
|--------|-------------|
| 💵 Cash on Delivery | Pay when you receive |
| 📱 UPI | Google Pay, PhonePe, Paytm |
| 💳 Credit/Debit Card | Visa, Mastercard, RuPay |
| 🏦 Net Banking | All major Indian banks |
| 👛 Wallets | Amazon Pay, Paytm, etc. |
| 📊 EMI | 3/6/9/12 month options |

> Note: Payment simulation is enabled for demo purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sharansh Jha**

---

<p align="center">
  <strong>⭐ Star this repo if you found it helpful!</strong>
</p>
