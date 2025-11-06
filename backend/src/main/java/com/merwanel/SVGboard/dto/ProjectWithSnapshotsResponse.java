package com.merwanel.SVGboard.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ProjectWithSnapshotsResponse(
    Long id,
    String title,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<SnapshotResponse> snapshots
) {}
