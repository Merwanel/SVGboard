package com.merwanel.SVGboard.controller;

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

import java.util.stream.IntStream;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseControllerTest {

    @Autowired
    protected ProjectRepository projectRepository;

    @Autowired
    protected SnapshotRepository snapshotRepository;

    @BeforeEach
    void setUp() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
        create5ProjectWithSnapshots();
    }

    @AfterEach
    void tearDown() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
    }

    protected void create5ProjectWithSnapshots() {
        IntStream.range(0, 5).forEach(i -> {
            createProjectWithSnapshots("project " + i, 4);
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
