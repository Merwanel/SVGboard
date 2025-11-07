package com.merwanel.SVGboard.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;

@Entity
@Table(name = "snapshot")
@Data
public class Snapshot {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "shapes_data", nullable = false, columnDefinition = "JSON")
    private String shapesData;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
