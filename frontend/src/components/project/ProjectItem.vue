<script setup lang="ts">
import { formatDate } from '@/utils/dateFormat'
import SvgPreview from '@/components/common/SvgPreview.vue'
import SnapshotItem from './SnapshotItem.vue'
import type { SnapshotResponse } from '@/types/api'

interface Project {
  id: number
  title: string
  updatedAt: string
  lastShapesData?: string
}

const props = defineProps<{
  project: Project
  isExpanded: boolean
  snapshots?: SnapshotResponse[]
}>()

const emit = defineEmits<{
  open: [projectId: number]
  edit: [projectId: number, newTitle: string]
  delete: [projectId: number]
  toggleExpand: [projectId: number]
  restoreSnapshot: [snapshotId: number, shapesData: string]
}>()

const getLatestSnapshotData = (): string => {
  return props.project.lastShapesData || '[]'
}
</script>

<template>
  <div class="project-wrapper">
    <div class="project-item" @click="emit('open', project.id)">
      <button
        class="expand-toggle"
        @click.stop="emit('toggleExpand', project.id)"
        :title="isExpanded ? 'Collapse' : 'Expand snapshots'"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </button>
      <div class="project-preview">
        <SvgPreview
          :shapes-data="getLatestSnapshotData()"
          size="large"
        />
      </div>
      <div class="project-info">
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="project-date">{{ formatDate(project.updatedAt) }}</p>
        <div>
          <input
          type="text"
          :value="project.title"
          @input="(e) => emit('edit', project.id, (e.target as HTMLInputElement).value)"
          />
        </div>
      </div>
      <button
        class="delete-btn"
        @click.stop="emit('delete', project.id)"
        title="Delete project"
      >
        ×
      </button>
    </div>
    
    <div v-if="isExpanded && snapshots" class="snapshots-list">
      <SnapshotItem
        v-for="snapshot in snapshots"
        :key="snapshot.id"
        :snapshot="snapshot"
        @restore="(snapshotId, shapesData) => emit('restoreSnapshot', snapshotId, shapesData)"
      />
    </div>
  </div>
</template>

<style scoped>
.project-wrapper {
  display: flex;
  flex-direction: column;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.project-item:hover {
  border-color: var(--action-color);
  background: var(--action-color-light);
}

.expand-toggle {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.75rem;
  padding: 0.25rem;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.expand-toggle:hover {
  color: var(--action-color);
}

.project-preview {
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border: none;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
}

.project-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.2);
}

.project-date {
  margin: 0.25rem 0 0 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.snapshots-list {
  margin-left: 2rem;
  margin-top: 0.5rem;
  padding-left: 1rem;
  border-left: 2px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
