package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.dto.ProjectRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProjectControllerTest extends BaseControllerTest {


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
    void shouldGetAllProjects() throws Exception {
        mockMvc.perform(
            get("/projects")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(NB_ENTRIES_PR))
            .andExpect(jsonPath("$[0].title").value("project 4"));
    }
}
