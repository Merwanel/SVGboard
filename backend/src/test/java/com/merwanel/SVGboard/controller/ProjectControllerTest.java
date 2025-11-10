package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.dto.ProjectRequest;
import com.merwanel.SVGboard.entity.Project;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProjectControllerTest extends BaseControllerTest {
    
    @Test
    void shouldGetAllProjects() throws Exception {
        mockMvc.perform(
            get("/projects")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(NB_ENTRIES_PR))
            .andExpect(jsonPath("$[0].title").value("project 4"));
    }

    @Test
    void shouldGetLastProject() throws Exception {
        mockMvc.perform(
            get("/projects/latest")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("id").value(lastProject.getId()))
            .andExpect(jsonPath("snapshots").isNotEmpty());
    }

    @Test
    void shouldGetProject() throws Exception {
        mockMvc.perform(
            get("/projects/{id}", lastProject.getId())
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("id").value(lastProject.getId()))
            .andExpect(jsonPath("snapshots").doesNotHaveJsonPath());
    }

    @Test
    void shouldCreateProject() throws Exception {
        ProjectRequest request = new ProjectRequest("Test Project");

        mockMvc.perform(
            post("/projects")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.title").value("Test Project"));
        
        var projects = projectRepository.findAll();
        assertThat(projects).hasSize(NB_ENTRIES_PR + 1);
        assertThat(projects.stream().filter(p -> p.getTitle().equals("Test Project")).count()).isEqualTo(1);
    }

    @Test
    void shouldUpdateProject() throws Exception {
        String newTitle = "new title";
        ProjectRequest request = new ProjectRequest(newTitle);
        
        mockMvc.perform(
            patch("/projects/{id}", lastProject.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.title").value(newTitle));
            
        Project updatedProject = projectRepository.findById(lastProject.getId())
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + lastProject.getId()));

        assertThat(updatedProject.getTitle()).isEqualTo(newTitle);
    }
    
    @Test
    void shouldDeleteProject() throws Exception {
        mockMvc.perform(
            delete("/projects/{id}", lastProject.getId())
        )
            .andExpect(status().isNoContent()) ;
            
            var projects = projectRepository.findAll();
        assertThat(projects).hasSize(NB_ENTRIES_PR -1);
    }
}
