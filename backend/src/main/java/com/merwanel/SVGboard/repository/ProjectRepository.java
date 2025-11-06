package com.merwanel.SVGboard.repository;

import com.merwanel.SVGboard.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findFirstByOrderByCreatedAtDesc();
}
