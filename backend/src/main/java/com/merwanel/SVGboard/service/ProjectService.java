package com.merwanel.SVGboard.service;

import com.merwanel.SVGboard.dto.ProjectRequest;
import com.merwanel.SVGboard.dto.ProjectResponse;
import com.merwanel.SVGboard.dto.ProjectWithSnapshotsResponse;
import com.merwanel.SVGboard.dto.SnapshotResponse;
import com.merwanel.SVGboard.entity.Project;
import com.merwanel.SVGboard.entity.Snapshot;
import com.merwanel.SVGboard.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAllByOrderByUpdatedAtDesc().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }
    
    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
            project.getId(),
            project.getTitle(),
            project.getLastShapesData(),
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }
    
    
    public ProjectWithSnapshotsResponse getLatestProjectWithSnapshots() {
        Project project = projectRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseThrow(() -> new RuntimeException("No projects found"));
        return toResponseWithSnapshots(project);
    }
    
    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        return toResponse(project);
    }
    
    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        Project project = new Project();
        project.setTitle(request.title());
        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }
    
    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
        project.setTitle(request.title());
        Project updated = projectRepository.save(project);
        return toResponse(updated);
    }
    
    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Project not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }
    
    
    private ProjectWithSnapshotsResponse toResponseWithSnapshots(Project project) {
        return new ProjectWithSnapshotsResponse(
            project.getId(),
            project.getTitle(),
            project.getCreatedAt(),
            project.getUpdatedAt(),
            project.getSnapshots().stream()
                .map(this::toSnapshotResponse)
                .collect(Collectors.toList())
        );
    }
    
    private SnapshotResponse toSnapshotResponse(Snapshot snapshot) {
        return new SnapshotResponse(
            snapshot.getId(),
            snapshot.getProjectId(),
            snapshot.getShapesData(),
            snapshot.getCreatedAt()
        );
    }
}
