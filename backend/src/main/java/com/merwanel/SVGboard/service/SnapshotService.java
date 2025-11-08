package com.merwanel.SVGboard.service;

import com.merwanel.SVGboard.dto.SnapshotRequest;
import com.merwanel.SVGboard.dto.SnapshotResponse;
import com.merwanel.SVGboard.entity.Snapshot;
import com.merwanel.SVGboard.repository.SnapshotRepository;
import com.merwanel.SVGboard.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SnapshotService {
    
    private final SnapshotRepository snapshotRepository;
    private final ProjectRepository projectRepository;
    
    
    private SnapshotResponse toResponse(Snapshot snapshot) {
        return new SnapshotResponse(
            snapshot.getId(),
            snapshot.getProjectId(),
            snapshot.getShapesData(),
            snapshot.getCreatedAt()
        );
    }

    public List<SnapshotResponse> getSnapshotsByProjectId(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        return snapshotRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public SnapshotResponse getSnapshotById(Long projectId, Long snapshotId) {
        Snapshot snapshot = snapshotRepository.findById(snapshotId)
                .orElseThrow(() -> new RuntimeException("Snapshot not found with id: " + snapshotId));
        if (!snapshot.getProjectId().equals(projectId)) {
            throw new RuntimeException("Snapshot " + snapshotId + " does not belong to project " + projectId);
        }
        return toResponse(snapshot);
    }
    
    @Transactional
    public SnapshotResponse createSnapshot(Long projectId, SnapshotRequest request) {
        var project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        Snapshot snapshot = new Snapshot();
        snapshot.setProjectId(projectId);
        snapshot.setShapesData(request.shapesData());
        Snapshot saved = snapshotRepository.save(snapshot);
        
        project.setLastShapesData(request.shapesData());
        projectRepository.save(project);
        
        return toResponse(saved);
    }
    
    public void deleteAllSnapshots(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }
        snapshotRepository.deleteByProjectId(projectId);
    }
    
    @Transactional
    public void deleteSnapshot(Long projectId, Long snapshotId) {
        Snapshot snapshot = snapshotRepository.findById(snapshotId)
                .orElseThrow(() -> new RuntimeException("Snapshot not found with id: " + snapshotId));
        if (!snapshot.getProjectId().equals(projectId)) {
            throw new RuntimeException("Snapshot " + snapshotId + " does not belong to project " + projectId);
        }
        snapshotRepository.deleteById(snapshotId);
    }
}
