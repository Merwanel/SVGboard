package com.merwanel.SVGboard.service;

import com.merwanel.SVGboard.dto.ProjectRequest;
import com.merwanel.SVGboard.dto.ProjectResponse;
import com.merwanel.SVGboard.dto.ProjectWithSnapshotsResponse;
import com.merwanel.SVGboard.dto.SnapshotResponse;
import com.merwanel.SVGboard.entity.Project;
import com.merwanel.SVGboard.entity.Snapshot;
import com.merwanel.SVGboard.exception.ResourceNotFoundException;
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
        return projectRepository.findAll().stream()
        .map(this::toResponse)
        .collect(Collectors.toList());
    }
    
    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
            project.getId(),
            project.getTitle(),
            project.getCreatedAt(),
            project.getUpdatedAt()
        );
    }
}