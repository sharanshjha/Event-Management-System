# 🎊 Event Management & Vendor System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)](https://www.mongodb.com/mern-stack)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-orange?style=for-the-badge)](https://cloudinary.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-red?style=for-the-badge)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> A premium, full-stack event management solution where Users can browse products, Vendors can manage their inventory, and Admins control the ecosystem.

---

## ✨ Features

### 👤 User Side
- 🛍️ **Browse Products**: Sleek, responsive grid view of all available items.
- 🔍 **Real-time Search**: Find what you need instantly.
- 🛒 **Cart System**: Seamlessly add products to your cart.
- 💳 **Checkout**: Secure checkout with guest information support.
- 📦 **Order Tracking**: Keep tabs on your orders and status.

### 🏪 Vendor Dashboard
- 📈 **Business Insights**: Overview of active, pending, and deleted products.
- ➕ **Product Management**: Add and update products with Cloudinary-powered image uploads.
- 📝 **Item Requests**: Request new items from the Admin.
- 💸 **Transaction History**: View all orders containing your products.

### 🛡️ Admin Panel
- 👥 **User/Vendor Management**: Full control over user accounts.
- 💎 **Membership Control**: Upgrade vendors to Premium or basic status.
- 📋 **Order Monitoring**: Oversight of all transactions in the system.
- 📥 **Request Handling**: Approve or reject vendor item requests.

---

## 🚀 Tech Stack

- **Frontend**: React.js, Vite, Vanilla CSS (Custom Design System)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary OSS

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/sharan-jha/Event-Management-System.git
cd Event-Management-System
```

### 2. Backend Configuration
Navigate to `server/` and create a `.env` file:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Install Dependencies
```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 4. Run the Application
```bash
# Start Backend (from server directory)
npm run dev

# Start Frontend (from client directory)
npm run dev
```

---

## 📸 Mockups & Design

| User Dashboard | Vendor Panel | Admin Control |
| :---: | :---: | :---: |
| ![User](https://via.placeholder.com/300x200?text=Premium+User+UI) | ![Vendor](https://via.placeholder.com/300x200?text=Vendor+Dashboard) | ![Admin](https://via.placeholder.com/300x200?text=Admin+Analytics) |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

Created with ❤️ by [Sharansh](https://github.com/sharansh-jha)
