# 🌉 Bridge - Connecting Dialogues

**Bridge** is a modern, real-time chat application built for seamless communication. It combines high-performance real-time messaging with a premium, responsive UI/UX designed for both productivity and personal connection.

![Bridge Landing Page Mockup](https://raw.githubusercontent.com/your-username/bridge-chat-app/main/screenshots/landing.png)

---

## ✨ Features

### 🚀 Real-Time Messaging
- **Instant Delivery**: Powered by Socket.io for sub-millisecond message delivery.
- **Message Management**: Send, edit, and delete messages with real-time updates for all participants.
- **Optimistic UI**: Messages appear instantly in your chat window while syncing with the server in the background.
- **Typing Indicators**: See when your contacts are typing in real-time.
- **Message Forwarding**: Share important messages across different conversations with ease.

### 🛡️ Robust Authentication
- **NextAuth.js Integration**: Secure authentication with JWT session management.
- **Persistent Sessions**: Stay logged in with configurable 30-day session persistence.
- **Smart Redirects**: Server-side middleware handles authentication guards, ensuring instant routing for logged-in users.
- **Live Validation**: Real-time username availability checks during signup.

### 🎨 Premium UI/UX
- **Dual Theme Support**: Beautifully crafted Light and Dark modes with automatic persistence.
- **Glassmorphism Design**: Modern, sleek interface with subtle blurs and smooth transitions.
- **Animations**: Integrated Lottie animations for a lively and engaging experience.
- **Fully Responsive**: Optimized for mobile, tablet, and desktop views.
- **Toast Notifications**: Interactive feedback using `react-hot-toast`.

### 📂 Advanced Chat Management
- **Contact Discovery**: Easily find and connect with other users.
- **Archive & Block**: Manage your conversation list by archiving inactive chats or blocking users.
- **Rich Media Support**: Share images, documents, and voice messages (supported via integrated file handling).
- **Profile Customization**: Update your bio, location, and profile picture directly from the app.

---

## 🛠️ Tech Stack

### Frontend Core
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: React Hooks & Context API

### Communication & Data
- **Real-time**: [Socket.io Client](https://socket.io/)
- **API Client**: [Axios](https://axios-http.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)

### UI Components & Utilities
- **Animations**: [Lottie React](https://github.com/Gamote/lottie-react)
- **Icons**: Custom SVG Icons & Lucide-inspired designs
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Avatars**: [DiceBear API](https://www.dicebear.com/)

---

## 📂 Project Structure

```text
bridge-frontend/
├── public/              # Static assets & Lottie animations
├── src/
│   ├── app/             # Next.js App Router (Pages & API)
│   │   ├── chat/        # Core Chat Experience
│   │   ├── signup/      # User Registration
│   │   ├── api/auth/    # NextAuth configuration
│   │   └── layout.js    # Root layout with providers
│   ├── components/      # Reusable UI Components
│   │   ├── ChatArea/    # Messaging interface
│   │   ├── Sidebar/     # Navigation & Contacts
│   │   ├── Avatar/      # Dynamic user avatars
│   │   └── SocketProvider.js # Socket.io context
│   ├── lib/             # Utilities (Axios instance, etc.)
│   └── middleware.js    # Auth & routing middleware
├── tailwind.config.js   # Custom theme configuration
└── package.json         # Dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ 
- NPM or Yarn
- A running instance of the [Bridge Backend](https://github.com/your-username/bridge-backend)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/bridge-frontend.git
cd bridge-frontend
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_next_auth_secret_here
```

### 4. Running the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application in action.

---

## 📝 Roadmap
- [ ] Group Chat functionality
- [ ] End-to-End Encryption (E2EE)
- [ ] Video & Audio Calling
- [ ] Message Search History
- [ ] PWA Support for mobile installation

---

## 📄 License
This project is licensed under the MIT License.

---

Built with ❤️ by the Bridge Team.
