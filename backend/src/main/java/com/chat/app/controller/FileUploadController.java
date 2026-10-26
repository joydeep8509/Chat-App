package com.chat.app.controller;

import com.chat.app.model.FileUploadResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@RestController
@RequestMapping("/api/media")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class FileUploadController {

    private static final Logger log = LoggerFactory.getLogger(FileUploadController.class);

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private Path fileStorageLocation;

    @PostConstruct
    public void init() {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
            log.info("Upload directory initialized at: {}", this.fileStorageLocation);
        } catch (IOException ex) {
            log.error("Could not create the upload directory at {}", this.fileStorageLocation, ex);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            log.warn("Upload rejected: empty file submitted");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File cannot be empty.");
        }

        try {
            if (!Files.exists(this.fileStorageLocation)) {
                Files.createDirectories(this.fileStorageLocation);
            }

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
            Path targetFilePath = this.fileStorageLocation.resolve(uniqueFileName);
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

            // Generates an absolute URL so deployed clients can resolve the backend host directly
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(uniqueFileName)
                    .toUriString();

            FileUploadResponse response = new FileUploadResponse(
                    fileUrl,
                    originalFileName,
                    mediaType,
                    file.getSize()
            );

            log.info("Media stored successfully: {} as {} with URL: {}", originalFileName, uniqueFileName, fileUrl);
            return ResponseEntity.ok(response);
        } catch (IOException ex) {
            log.error("Failed to store file", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store file: " + ex.getMessage());
        }
    }

    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            return ResponseEntity.badRequest().build();
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}