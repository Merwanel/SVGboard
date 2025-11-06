package com.merwanel.SVGboard.dto;

import java.time.LocalDateTime;

public record SnapshotResponse(
    Long id,
    Long projectId,
    String shapesData,
    LocalDateTime createdAt
) {}
