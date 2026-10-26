package com.chat.app.controller;

import com.chat.app.model.ChatMessage;
import com.chat.app.repository.ChatMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ChatController {

    private final ChatMessageRepository repo;
    private final SimpMessagingTemplate ws;

    public ChatController(ChatMessageRepository repo, SimpMessagingTemplate ws) {
        this.repo = repo;
        this.ws = ws;
    }

    @GetMapping("/history")
    public List<ChatMessage> getMessageHistory() {
        return repo.findAllByOrderByTimestampAsc();
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(@Payload ChatMessage msg) {
        if (msg.getTimestamp() == null) msg.setTimestamp(LocalDateTime.now());
        return repo.save(msg);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        ws.convertAndSend("/topic/messages/delete", Map.of("id", id));
        return ResponseEntity.ok(Map.of("status", "DELETED", "id", id));
    }

    @MessageMapping("/deleteMessage")
    public void deleteSocket(@Payload Map<String, Object> payload) {
        Object rawId = payload.get("id");
        if (rawId == null) return;
        try {
            Long id = Long.valueOf(rawId.toString());
            if (repo.existsById(id)) {
                repo.deleteById(id);
                ws.convertAndSend("/topic/messages/delete", Map.of("id", id));
            }
        } catch (NumberFormatException ignored) {}
    }
}