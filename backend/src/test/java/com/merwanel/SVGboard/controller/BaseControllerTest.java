package com.merwanel.SVGboard.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.merwanel.SVGboard.entity.Project;
import com.merwanel.SVGboard.entity.Snapshot;
import com.merwanel.SVGboard.repository.ProjectRepository;
import com.merwanel.SVGboard.repository.SnapshotRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.stream.IntStream;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseControllerTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected SnapshotRepository snapshotRepository;

    protected int NB_ENTRIES_PR = 5;
    protected int NB_ENTRIES_SS = 5;
    
    protected Project lastProject ;

    @BeforeEach
    void setUp() {
        createNBProjectWithSnapshots();
    }

    @AfterEach
    void tearDown() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
    }

    protected void createNBProjectWithSnapshots() {
        IntStream.range(0, NB_ENTRIES_PR).forEach(i -> {
            lastProject = createProjectWithSnapshots("project " + i, NB_ENTRIES_SS);
        });
    }

    protected Project createProjectWithSnapshots(String title, int snapshotCount) {
        Project project = new Project();
        project.setTitle(title);
        Project savedProject = projectRepository.save(project);

        for (int i = 1; i <= snapshotCount; i++) {
            Snapshot snapshot = new Snapshot();
            snapshot.setProjectId(savedProject.getId());
            snapshot.setShapesData("{\"shapes\": []}");
            snapshotRepository.save(snapshot);
        }
        
        return savedProject;
    }
}
