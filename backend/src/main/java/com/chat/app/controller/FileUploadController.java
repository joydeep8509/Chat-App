package com.chat.app.controller;

import com.chat.app.model.FileUploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            log.warn("Upload rejected: empty file submitted");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File cannot be empty.");
        }

        try {
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetLocation);

            String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
            if (originalFileName.contains("..")) {
                log.warn("Upload rejected: invalid filename path sequence: {}", originalFileName);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid filename path sequence.");
            }

            String extension = "";
            int dotIndex = originalFileName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = originalFileName.substring(dotIndex);
            }

            String uniqueFileName = UUID.randomUUID().toString() + extension;
            Path targetFilePath = targetLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetFilePath, StandardCopyOption.REPLACE_EXISTING);

            String contentType = file.getContentType();
            String mediaType = "FILE";
            if (contentType != null) {
                if (contentType.startsWith("image/")) {
                    mediaType = "IMAGE";
                } else if (contentType.startsWith("video/")) {
                    mediaType = "VIDEO";
                }
            }

            String fileUrl = "/uploads/" + uniqueFileName;
            FileUploadResponse response = new FileUploadResponse(
                    fileUrl,
                    originalFileName,
                    mediaType,
                    file.getSize()
            );

            log.info("Media stored successfully: {} as {}", originalFileName, uniqueFileName);
            return ResponseEntity.ok(response);

        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store file: " + ex.getMessage());
        }
    }
}