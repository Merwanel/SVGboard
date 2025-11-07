package com.merwanel.SVGboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merwanel.SVGboard.TestDataHelper;
import com.merwanel.SVGboard.dto.ProjectRequest;
import com.merwanel.SVGboard.repository.ProjectRepository;
import com.merwanel.SVGboard.repository.SnapshotRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SnapshotRepository snapshotRepository;

    @BeforeEach
    void setUp() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
        TestDataHelper.create5ProjectWithSnapshots(projectRepository, snapshotRepository);
    }

    @AfterEach
    void tearDown() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
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
        assertThat(projects).hasSize(6); // 5 from setUp + 1 new
        assertThat(projects.stream().filter(p -> p.getTitle().equals("Test Project")).count()).isEqualTo(1);
    }

    @Test
    void shouldGetAllProjects() throws Exception {
        mockMvc.perform(
            get("/projects")
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(5))
            .andExpect(jsonPath("$[0].title").value("project 0"));
    }
}
