# Real-time Chat Application

A simple real-time chat application built with Spring Boot and WebSockets. Perfect for learning how WebSocket communication works or as a starting point for your own chat features.

## What does it do?

This app lets multiple users chat with each other in real-time. When someone sends a message, everyone else sees it instantly without needing to refresh the page. It's like a basic version of Slack or Discord, but much simpler.

## Tech Stack

- **Spring Boot 3.5.5** - The main framework that holds everything together
- **WebSockets** - For real-time bidirectional communication
- **STOMP** - A messaging protocol that works over WebSockets
- **Thymeleaf** - For rendering the web pages
- **Lombok** - To reduce boilerplate code (goodbye, endless getters and setters!)
- **SockJS** - Fallback options when WebSockets aren't available

## How to run it

1. **Make sure you have Java 17 or higher installed**
   ```bash
   java --version
   ```

2. **Clone the repository** (or however you got this code)

3. **Navigate to the project directory**
   ```bash
   cd your-chat-app-folder
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or if you're on Windows:
   ```bash
   mvnw.cmd spring-boot:run
   ```

5. **Open your browser and go to** `http://localhost:8080/chat`

6. **Open another tab or browser window** to `http://localhost:8080/chat` and start chatting between the windows!

## Project Structure

```
src/main/java/com/chat/app/
├── AppApplication.java          # Main Spring Boot application
├── config/
│   └── WebSocketConfig.java     # WebSocket configuration
├── controller/
│   └── ChatController.java      # Handles chat messages
└── model/
    └── ChatMessage.java         # Message data structure
```

## How it works

1. **WebSocket Connection**: When you visit `/chat`, your browser establishes a WebSocket connection to `/chat` endpoint
2. **Send Message**: When you type a message, it gets sent to `/app/sendMessage`
3. **Broadcast**: The server receives the message and broadcasts it to all connected clients via `/topic/messages`
4. **Real-time Updates**: Everyone subscribed to `/topic/messages` receives the new message instantly

## Features

- ✅ Real-time messaging
- ✅ Multiple users can chat simultaneously  
- ✅ Simple and clean setup
- ✅ Works across different browser tabs/windows
- ✅ SockJS fallback for better compatibility

## Customization Ideas

Want to make this your own? Here are some ideas:

- Add user authentication and display usernames
- Store chat history in a database
- Add different chat rooms/channels
- Implement private messaging
- Add message timestamps
- Create a nicer frontend with CSS/JavaScript
- Add emoji support
- Implement message editing/deletion

## Troubleshooting

**Port 8080 already in use?**
- Change the port in `application.properties`: `server.port=8081`

**Messages not showing up?**
- Check the browser console for WebSocket connection errors
- Make sure you're connected to the right URL
- Try refreshing the page

**Can't build the project?**
- Make sure you have Java 17+ installed
- Try `./mvnw clean install` first

## Contributing

Feel free to fork this project and add your own features! It's a great way to learn about WebSockets and real-time applications.

## License

This is a demo project, so do whatever you want with it. Learn, modify, improve, and share!