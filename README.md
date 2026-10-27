# Real-Time Chat App 2.0

A high-performance, decoupled real-time messaging platform built with a **Next.js 15 App Router** frontend and a **Spring Boot 3.5** WebSocket & REST backend backed by **MySQL 8.0**.

## Architecture Overview

```
               Browser (Client)
             [ Next.js 15 Frontend ]
               (Port: 3000 / pnpm)
                 |          |
   STOMP / SockJS|          | REST API (Multipart / JSON / Delete)
                 v          v
          +-------------------------------+
          |     Next.js Proxy Rewrites    |
          |       (/chat, /api, /uploads) |
          +-------------------------------+
                         |
                         v
              [ Spring Boot 3 Backend ]
                 (Port: 8080 / Java 17)
                         |
       +-----------------+-----------------+
       |                                   |
       v                                   v
[ Local Disk: /uploads ]         [ MySQL 8.0 Database ]
(100MB File/Media Store)          (chatdb / utf8mb4)

```

## Key Features

* **Bidirectional Real-Time Communication**: Uses STOMP over SockJS protocol (`/chat`) with automatic reconnect handling, instant message pub/sub broadcasting (`/topic/messages`), and real-time deletion events (`/topic/messages/delete`).

* **Real-Time Message Deletion & Moderation**:

  * Contextual trash action button directly on sent messages.

  * Custom glassmorphic on-screen confirmation modal (eliminating intrusive browser popups).

  * Dual-path deletion via REST (`DELETE /api/messages/{id}`) or STOMP (`/app/deleteMessage`).

  * Optimistic client-side cache purge combined with global WebSocket broadcasts to remove messages instantly across all connected screens.

* **Dual-Tier Authentication**:

  * **Google OAuth 2.0**: Native client verification using `@react-oauth/google` with read-only profile locking.

  * **Guest Access**: Instant randomized identity assignment (`Guest_XXXX`) with debounced inline alias editing.

* **Multimedia Sharing Engine**: Handles direct uploads of images, videos, and arbitrary documents (PDFs, text) up to 100MB via chunked multipart form handling.

* **Mobile Responsive Layout**: Dynamic viewport height (`100dvh`) with rigid flex constraints (`min-h-0`, `shrink-0`) to keep the typing bar and media preview pinned to the bottom without mobile browser UI dislocation.

* **Zero-Dependency Tailwind CSS v4 Styling**: Built on the Tailwind v4 engine using `@theme` animations, CSS glassmorphism, responsive breakpoints, and custom scrollbar suppression without legacy config files.

* **Production-Grade Persistence**: Backed by MySQL 8.0 with `utf8mb4_unicode_ci` support to safely store emojis, chat logs, and media metadata.

* **Client-Side Performance Optimizations**:

  * `React.memo` message bubble caching to prevent unnecessary re-renders.

  * Memory leak prevention via automated `URL.revokeObjectURL()` blob URL cleanup.

  * Smart scroll locking that preserves chat history position when browsing older messages.

  * Client-side pre-flight file validation to intercept uploads exceeding 100MB before network consumption.

  * Lazy-loaded fullscreen lightbox modals for photo zooming.

## Tech Stack

### Frontend

* **Framework**: Next.js 15 (App Router, Server & Client Components)

* **Package Manager**: pnpm

* **Styling**: Tailwind CSS v4 (Pure CSS `@theme` architecture)

* **WebSockets & STOMP**: `@stomp/stompjs` + `sockjs-client` (Browser-safe bundle)

* **Authentication**: `@react-oauth/google`

* **Icons**: `lucide-react`

* **Language**: TypeScript (Strict Mode)

### Backend

* **Framework**: Spring Boot 3.5.5 (Java 17)

* **Protocol**: Spring WebSocket STOMP Messaging with SimpleBroker

* **Persistence**: Spring Data JPA & Hibernate

* **Database**: MySQL 8.0 with HikariCP Connection Pooling

* **Boilerplate Reduction**: Project Lombok

* **Build Tool**: Apache Maven

## Project Structure

```
Real-time-chat-app-2.0/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/chat/app/
│   │   │   │   ├── config/              # WebMvcConfig (CORS/Uploads), WebSocketConfig (STOMP)
│   │   │   │   ├── controller/          # AuthController, ChatController, FileUploadController
│   │   │   │   ├── model/               # ChatMessage, UserDto, FileUploadResponse entities
│   │   │   │   ├── repository/          # ChatMessageRepository (JPA queries)
│   │   │   │   └── AppApplication.java  # Main Spring Boot Entrypoint
│   │   │   └── resources/
│   │   │       ├── application.properties         # Local dev configuration (git-ignored)
│   │   │       └── application.properties.example # Environment variable reference template
│   │   └── test/
│   ├── pom.xml                          # Maven build dependencies
│   └── uploads/                         # Dynamic local storage for media attachments
│
├── frontend/
│   ├── .env.local                       # Frontend environment variables
│   ├── next.config.mjs                  # Proxy rewrites and remote image optimization policies
│   ├── package.json                     # pnpm dependencies and project scripts
│   ├── postcss.config.mjs               # PostCSS setup for Tailwind v4
│   ├── tsconfig.json                    # Strict TypeScript configurations
│   └── src/
│       ├── app/
│       │   ├── globals.css              # Tailwind v4 directives & keyframe definitions
│       │   ├── layout.tsx               # Root layout & GoogleOAuth provider
│       │   └── page.tsx                 # App orchestrator (Auth, Chat view, & Deletion state)
│       ├── components/
│       │   ├── AuthScreen.tsx           # Glassmorphism login screen (Google & Guest)
│       │   ├── ChatHeader.tsx           # Global status bar & room activity indicator
│       │   ├── ChatInput.tsx            # Caption input, attachment trigger, & IME guard
│       │   ├── ChatMessages.tsx         # Message feed with smart scroll locking
│       │   ├── MediaPreview.tsx         # Responsive upload dock & fullscreen lightbox
│       │   ├── MessageBubble.tsx        # Chat bubbles with on-screen delete confirmation
│       │   └── Sidebar.tsx              # Identity card, guest editor, and logout
│       ├── hooks/
│       │   ├── useAuth.ts               # Storage persistence and server session synchronization
│       │   └── useChatSocket.ts         # Isolated STOMP lifecycle manager (messages & deletion)
│       ├── lib/
│       │   ├── api.ts                   # Centralized type-safe REST client (CRUD & Media)
│       │   └── utils.ts                 # Byte formatting and timestamp helpers
│       └── types/
│           └── index.ts                 # Shared TypeScript models matching Java entities
│
└── README.md

```

## Environment Configuration

### 1. Frontend (`frontend/.env.local`)

Create a `.env.local` file inside the `frontend/` directory:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/chat

```

### 2. Backend Database Setup (MySQL)

Initialize your MySQL database with UTF-8 four-byte support:

```
CREATE DATABASE IF NOT EXISTS chatdb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

```

Backend configuration parameters (set in `application.properties` or as cloud runtime environment variables):

| Environment Variable | Description | Default Fallback | 
| ----- | ----- | ----- | 
| `DB_HOST` | MySQL hostname or IP | `localhost` | 
| `DB_PORT` | MySQL connection port | `3306` | 
| `DB_NAME` | MySQL target schema | `chatdb` | 
| `DB_USERNAME` | Database username | `root` | 
| `DB_PASSWORD` | Database password | `password` | 
| `FILE_UPLOAD_DIR` | Directory for persistent uploads | `uploads` | 

## Getting Started

### Prerequisites

* **Node.js**: v18.18.0 or v20+

* **Package Manager**: `pnpm` (`npm install -g pnpm`)

* **Java Development Kit (JDK)**: Version 17 or higher

* **Build Tool**: Apache Maven (or use included `./mvnw`)

* **Database**: MySQL 8.0+

### Step 1: Start the MySQL Database

Ensure MySQL is running on port `3306`:

```
mysql -u root -p -e "SHOW DATABASES;"

```

*(Optional: Launch using Docker)*

```
docker run --name pyramid-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=chatdb \
  -p 3306:3306 -d mysql:8.0 \
  --character-set-server=utf8mb4 \
  --collation-server=utf8mb4_unicode_ci

```

### Step 2: Run the Spring Boot Backend

1. Navigate to the backend directory:

   ```
   cd backend
   
   ```

2. Compile and launch the application:

   ```
   # On macOS / Linux:
   ./mvnw spring-boot:run
   
   # On Windows:
   mvnw.cmd spring-boot:run
   
   ```

3. The backend will initialize on port `8080`:

   * REST API base path: `http://localhost:8080/api`

   * SockJS STOMP endpoint: `http://localhost:8080/chat`

   * Static media store: `http://localhost:8080/uploads/**`

### Step 3: Run the Next.js Frontend

1. Open a new terminal and navigate to the frontend directory:

   ```
   cd frontend
   
   ```

2. Install dependencies:

   ```
   pnpm install
   
   ```

3. Start the development server:

   ```
   pnpm dev
   
   ```

4. Open `http://localhost:3000` in your browser.

## API & WebSocket Reference

### WebSocket (STOMP over SockJS)

* **Handshake Endpoint**: `/chat`

* **Inbound Destinations**:

  * `/app/sendMessage` - Dispatches a new chat message

  * `/app/deleteMessage` - Requests deletion of a specific message ID

* **Outbound Topics**:

  * `/topic/messages` - Broadcasts incoming messages to all subscribers

  * `/topic/messages/delete` - Broadcasts deleted message IDs (`{"id": 42}`)

**Message Payload Format (`/app/sendMessage`):**

```
{
  "sender": "Joydeep",
  "content": "Hello team!",
  "type": "CHAT",
  "mediaUrl": null,
  "fileName": null,
  "fileSize": null,
  "avatarUrl": "https://lh3.googleusercontent.com/..."
}

```

**Delete Payload Format (`/app/deleteMessage`):**

```
{
  "id": 42
}

```

### REST Endpoints

| HTTP Method | Endpoint | Description | 
| ----- | ----- | ----- | 
| `GET` | `/api/messages/history` | Fetches chronological chat history | 
| `DELETE` | `/api/messages/{id}` | Deletes a message by ID and broadcasts deletion event | 
| `POST` | `/api/media/upload` | Multipart file upload (Max: 100MB); returns absolute URL and file metadata | 
| `GET` | `/api/media/files/{filename}` | Direct streaming endpoint for stored media attachments | 
| `POST` | `/api/auth/session` | Synchronizes active user session with server session | 
| `GET` | `/api/auth/me` | Validates and restores authenticated session | 
| `POST` | `/api/auth/logout` | Terminates backend session and clears state | 
| `GET` | `/uploads/{filename}` | Statically serves uploaded photos, videos, and files | 

## Production Build & Deployment

### Production Backend Packaging

```
cd backend
mvn clean package -DskipTests
java -jar target/app-0.0.1-SNAPSHOT.jar

```

### Production Frontend Build

```
cd frontend
pnpm build
pnpm start

```

## Troubleshooting

* **WebSocket Connection Refused (`/chat/info?t=... 404/500`)**:
  Ensure the Spring Boot backend is running on port `8080` and the CORS configuration in `WebMvcConfig.java` / `WebSocketConfig.java` permits your deployed frontend origin.

* **Broken Media Links After Cloud Deployment**:
  Ensure you have mounted a persistent disk to the `/uploads` directory on platforms like Railway or Render and configured the `FILE_UPLOAD_DIR` environment variable.

* **MySQL Encoding Issues with Emojis**:
  Verify your schema was initialized with `CHARACTER SET utf8mb4` and `COLLATE utf8mb4_unicode_ci`.

* **Google OAuth Popup Issues**:
  Confirm your local and production domains are registered under **Authorized JavaScript Origins** in your Google Cloud Console OAuth 2.0 Client credentials.

## License

This project is licensed under the MIT License. Contributions, bug reports, and pull requests are welcome!