package com.chat.app.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {
    private String fileUrl;
    private String fileName;
    private String fileType;
    private long size;
}