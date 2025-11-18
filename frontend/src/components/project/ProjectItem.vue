<script setup lang="ts">
import { ref } from 'vue'
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

const isEditingTitle = ref(false)
const editedTitle = ref(props.project.title)
const popoverRef = ref<HTMLDivElement | null>(null)

const openEditPopover = () => {
  isEditingTitle.value = true
  editedTitle.value = props.project.title
}

const saveTitle = () => {
  if (editedTitle.value.trim()) {
    emit('edit', props.project.id, editedTitle.value.trim())
  }
  isEditingTitle.value = false
}

const cancelEdit = () => {
  isEditingTitle.value = false
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') saveTitle()
  if (e.key === 'Escape') cancelEdit()
}

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
        <h3 class="project-title" @click.stop="openEditPopover">{{ project.title }}</h3>
        <p class="project-date">{{ formatDate(project.updatedAt) }}</p>
      </div>
      
      <div v-if="isEditingTitle" ref="popoverRef" class="edit-popover">
        <input
          v-model="editedTitle"
          type="text"
          class="edit-input"
          @keydown="handleKeydown"
          @blur="saveTitle"
          autofocus
        />
        <div class="popover-actions">
          <button class="btn-save" @click="saveTitle">Save</button>
          <button class="btn-cancel" @click="cancelEdit">Cancel</button>
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
  cursor: pointer;
  transition: color 0.2s ease;
}

.project-title:hover {
  color: var(--action-color);
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

.edit-popover {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 0.5rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 200px;
}

.edit-input {
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
  border: 1px solid var(--action-color);
  border-radius: 4px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
  font-family: inherit;
}

.edit-input:focus {
  outline: none;
  border-color: var(--action-color);
  box-shadow: 0 0 0 2px rgba(var(--action-color-rgb), 0.1);
}

.popover-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-save,
.btn-cancel {
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.btn-save {
  background: var(--action-color);
  color: white;
}

.btn-save:hover {
  opacity: 0.9;
}

.btn-cancel {
  background: var(--border-color);
  color: var(--text-secondary);
}

.btn-cancel:hover {
  background: var(--border-color);
  opacity: 0.7;
}
</style>
