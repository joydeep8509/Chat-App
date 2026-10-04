package com.chat.app.controller;

import com.chat.app.model.UserDto;
import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/session")
    public ResponseEntity<?> createSession(@RequestBody UserDto user, HttpSession session) {
        log.info("User session established: name='{}', isGuest={}", user.getName(), user.isGuest());
        session.setAttribute("user", user);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "user", user));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        UserDto user = (UserDto) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.ok(Map.of("authenticated", false));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        log.info("User session invalidated");
        session.invalidate();
        return ResponseEntity.ok(Map.of("status", "LOGGED_OUT"));
    }
}