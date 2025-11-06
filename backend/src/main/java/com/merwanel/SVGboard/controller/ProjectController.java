package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.dto.ProjectResponse;
import com.merwanel.SVGboard.service.ProjectService;
import lombok.RequiredArgsConstructor;
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
}