package com.travira.travira.controller;

import com.travira.travira.entity.ChatHistory;
import com.travira.travira.repository.ChatHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final ChatHistoryRepository repo;

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody ChatHistory chat) {
        repo.save(chat);
        return ResponseEntity.ok("Saved");
    }

    @GetMapping("/history/{userId}")
    public List<ChatHistory> history(@PathVariable Long userId) {
        return repo.findByUserIdOrderByTimeAsc(userId);
    }
}
