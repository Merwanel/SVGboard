package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.dto.ProjectRequest;
import com.merwanel.SVGboard.dto.ProjectResponse;
import com.merwanel.SVGboard.dto.ProjectWithSnapshotsResponse;
import com.merwanel.SVGboard.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    
    @GetMapping
    public List<ProjectResponse> getAllProjects() {
        return projectService.getAllProjects();
    }
    
    @GetMapping("/latest")
    public ProjectWithSnapshotsResponse getLatestProject() {
        return projectService.getLatestProjectWithSnapshots();
    }
    
    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse createProject(@RequestBody ProjectRequest request) {
        return projectService.createProject(request);
    }
    
    @PatchMapping("/{id}")
    public ProjectResponse updateProject(@PathVariable Long id, @RequestBody ProjectRequest request) {
        return projectService.updateProject(id, request);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }
}
