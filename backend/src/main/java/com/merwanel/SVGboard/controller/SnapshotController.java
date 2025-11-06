package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.dto.SnapshotRequest;
import com.merwanel.SVGboard.dto.SnapshotResponse;
import com.merwanel.SVGboard.service.SnapshotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects/{projectId}/snapshots")
@RequiredArgsConstructor
public class SnapshotController {
    
    private final SnapshotService snapshotService;
    
    @GetMapping
    public List<SnapshotResponse> getSnapshots(@PathVariable Long projectId) {
        return snapshotService.getSnapshotsByProjectId(projectId);
    }
    
    @GetMapping("/{snapshotId}")
    public SnapshotResponse getSnapshot(@PathVariable Long projectId, @PathVariable Long snapshotId) {
        return snapshotService.getSnapshotById(projectId, snapshotId);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SnapshotResponse createSnapshot(@PathVariable Long projectId, @RequestBody SnapshotRequest request) {
        return snapshotService.createSnapshot(projectId, request);
    }
    
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllSnapshots(@PathVariable Long projectId) {
        snapshotService.deleteAllSnapshots(projectId);
    }
    
    @DeleteMapping("/{snapshotId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSnapshot(@PathVariable Long projectId, @PathVariable Long snapshotId) {
        snapshotService.deleteSnapshot(projectId, snapshotId);
    }
}
