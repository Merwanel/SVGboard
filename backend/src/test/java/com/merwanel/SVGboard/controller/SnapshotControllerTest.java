package com.merwanel.SVGboard.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SnapshotControllerTest extends BaseControllerTest {

    @Test
    void shouldGetAllSnapshotsForProject() throws Exception {

        mockMvc.perform(
            get("/projects/{projectId}/snapshots", lastProject.getId())
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(NB_ENTRIES_SS))
            .andExpect(jsonPath("$[0].projectId").value(lastProject.getId()));
    }

    @Test
    void shouldGetSpecificSnapshot() throws Exception {
        Long snapshotId = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId()).get(0).getId();
        
        mockMvc.perform(
            get("/projects/{projectId}/snapshots/{snapshotId}", lastProject.getId(), snapshotId)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(snapshotId))
            .andExpect(jsonPath("$.projectId").value(lastProject.getId()))
            .andExpect(jsonPath("$.shapesData").exists());
    }
}
