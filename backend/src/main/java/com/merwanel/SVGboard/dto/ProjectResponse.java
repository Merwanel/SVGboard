package com.merwanel.SVGboard.dto;

import java.time.LocalDateTime;

public record ProjectResponse(
    Long id,
    String title,
    String lastShapesData,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
