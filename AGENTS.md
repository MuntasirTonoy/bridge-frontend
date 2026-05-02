# Bridge Chat App - Agent Instructions

Welcome to the **Bridge Chat App** development environment. This document provides a comprehensive overview of the application's architecture, tech stack, and development patterns to help you contribute effectively.

## 🚀 Project Overview
Bridge is a full-stack real-time messaging application featuring direct messaging, online status tracking, typing indicators, and message management (edit/delete).

---

## 🛠 Tech Stack

### Backend (`/bridge-backend`)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Auth**: JWT (JSON Web Tokens) & bcryptjs
- **File Uploads**: Multer

### Frontend (`/bridge-frontend`)
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **Real-time**: socket.io-client
- **HTTP Client**: Axios
- **UI Components**: React 19, Lucide React (icons), React Hot Toast (notifications)

---

## 📂 Project Structure

### Backend (`/bridge-backend/src`)
- `config/`: Database connection and environment configuration.
- `controllers/`: Business logic for API endpoints.
- `middleware/`: Authentication checks (`protect`) and error handling.
- `models/`: Mongoose schemas (User, Message, etc.).
- `routes/`: API route definitions.
- `server.js`: Entry point, Socket.io setup, and middleware integration.

### Frontend (`/bridge-frontend/src`)
- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Chat, Auth, Profile).
- `hooks/`: Custom React hooks (e.g., for socket management).
- `lib/`: Utility functions and shared logic.
- `data/`: Mock data or static constants (if any).

---

## 📡 API Reference (Backend)

### Auth Routes (`/api/auth`)
- `POST /signup`: Register a new user.
- `POST /login`: Authenticate user and return JWT.
- `GET /check-username`: Validate if a username is available.
- `GET /profile`: Get current logged-in user details (Protected).

### Chat Routes (`/api/chats`)
- `GET /conversations`: Get all chat threads for the user.
- `GET /messages/:userId`: Get message history with a specific user.
- `POST /messages`: Send a new message.
- `PUT /messages/:messageId`: Edit an existing message.
- `DELETE /messages/:messageId`: Delete a specific message.
- `DELETE /:userId`: Clear entire conversation with a user.

### User Routes (`/api/users`)
- `GET /`: Fetch/search for other users.

---

## 🔌 Socket.io Events

The application uses Socket.io for all real-time interactions:

| Event | Direction | Data | Description |
| :--- | :--- | :--- | :--- |
| `join` | Client -> Server | `userId` | Registers user as online. |
| `sendMessage` | Client -> Server | Message Object | Dispatches message to receiver. |
| `receiveMessage`| Server -> Client | Message Object | Notifies client of new message. |
| `typing` | Client -> Server | `senderId`, `receiverId` | Starts typing indicator. |
| `stopTyping` | Client -> Server | `senderId`, `receiverId` | Stops typing indicator. |
| `onlineUsers` | Server -> Client | `[userIds]` | Updates list of online users. |
| `messageUpdated`| Server -> Client | Message Object | Syncs edited message content. |
| `messageDeleted`| Server -> Client | `messageId` | Syncs message deletion. |

---

## 🔐 Authentication Flow
1. **Frontend**: Uses NextAuth.js with a `CredentialsProvider`.
2. **Backend**: Validates credentials and returns a JWT.
3. **Session**: NextAuth stores the JWT/User info in the session.
4. **API Calls**: Axios interceptors or local headers attach the `Authorization: Bearer <token>` for protected routes.

---

## 🛠 Development Workflow

### 1. Starting the Application
- **Backend**:
  ```bash
  cd bridge-backend
  npm run dev
  ```
- **Frontend**:
  ```bash
  cd bridge-frontend
  npm run dev
  ```

### 2. Environment Variables
Ensure `.env` files are configured in both directories:
- **Backend**: `PORT`, `MONGODB_URI`, `JWT_SECRET`.
- **Frontend**: `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_API_URL`.

### 3. Guidelines for AI Agents
- **Consistency**: Use Tailwind CSS for all new UI components.
- **Real-time**: When adding chat features, ensure both the HTTP API (for persistence) and Socket.io (for real-time) are updated.
- **Safety**: Always use the `protect` middleware on the backend for routes requiring authentication.
- **Modularity**: Keep components small and logic extracted into hooks where possible.

---

## 🏁 Current State & Roadmap
- [x] Basic Auth & Real-time messaging.
- [x] Edit/Delete messages.
- [x] Online status & Typing indicators.
- [x] Username availability check.
- [x] File/Image upload integration in chat UI (Images, PDFs).
- [x] Voice Message support.
- [x] Cloudinary source deletion on message delete.
- [ ] Group Chats (Future).
