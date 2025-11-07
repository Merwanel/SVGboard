package com.merwanel.SVGboard.controller;

import com.merwanel.SVGboard.TestDataHelper;
import com.merwanel.SVGboard.repository.ProjectRepository;
import com.merwanel.SVGboard.repository.SnapshotRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

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
        TestDataHelper.create5ProjectWithSnapshots(projectRepository, snapshotRepository);
    }

    @AfterEach
    void tearDown() {
        snapshotRepository.deleteAll();
        projectRepository.deleteAll();
    }
}
