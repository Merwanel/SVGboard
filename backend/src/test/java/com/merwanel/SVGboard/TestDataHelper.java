package com.merwanel.SVGboard;

import com.merwanel.SVGboard.entity.Project;
import com.merwanel.SVGboard.entity.Snapshot;
import com.merwanel.SVGboard.repository.ProjectRepository;
import com.merwanel.SVGboard.repository.SnapshotRepository;

import java.util.stream.IntStream;

public class TestDataHelper {

    public static void create5ProjectWithSnapshots(ProjectRepository projectRepository, SnapshotRepository snapshotRepository) {
        IntStream.range(0, 5).forEach(i -> {
            createProjectWithSnapshots("project " + i, 4, projectRepository, snapshotRepository);
        });
    }

    public static Project createProjectWithSnapshots(String title, int snapshotCount, ProjectRepository projectRepository, SnapshotRepository snapshotRepository) {
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
