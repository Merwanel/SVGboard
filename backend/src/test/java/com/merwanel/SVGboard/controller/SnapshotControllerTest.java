package com.merwanel.SVGboard.controller;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;

import com.merwanel.SVGboard.dto.SnapshotRequest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
    void shouldGetSnapshot() throws Exception {
        Long snapshotId = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId()).get(0).getId();
        
        mockMvc.perform(
            get("/projects/{projectId}/snapshots/{snapshotId}", lastProject.getId(), snapshotId)
        )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(snapshotId))
            .andExpect(jsonPath("$.projectId").value(lastProject.getId()))
            .andExpect(jsonPath("$.shapesData").exists());
    }

    @Test
    void shouldCreateSnapshot() throws Exception {
        String shapesData = "{\"shapes\": [{\"type\": \"circle\"}]}";
        SnapshotRequest request = new SnapshotRequest(shapesData);
        
        mockMvc.perform(
            post("/projects/{projectId}/snapshots", lastProject.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
        )
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.projectId").value(lastProject.getId()))
            .andExpect(jsonPath("$.shapesData").value(shapesData));
    }
    
    @Test
    void shouldDeleteAllSnapshots() throws Exception {
        var snapshotList = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId());
        int oldSize = snapshotList.size();
        
        mockMvc.perform(
            delete("/projects/{projectId}/snapshots", lastProject.getId())
        )
            .andExpect(status().isNoContent());
            
        int newSize = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId()).size();
            
        assertThat(oldSize).isNotEqualTo(0);
        assertThat(newSize).isEqualTo(0);
    }

    @Test
    void shouldDeleteSnapshot() throws Exception {
        var snapshotList = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId()) ;
        Long snapshotId = snapshotList.get(0).getId();
        int oldSize = snapshotList.size() ;
        
        mockMvc.perform(
            delete("/projects/{projectId}/snapshots/{snapshotId}", lastProject.getId(), snapshotId)
        )
            .andExpect(status().isNoContent());
        
        int newSize = snapshotRepository.findByProjectIdOrderByCreatedAtDesc(lastProject.getId()).size() ;

        assertThat(newSize).isEqualTo(oldSize - 1) ;
    }

}
