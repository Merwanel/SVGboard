<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useSnapshots } from '@/composables/useSnapshots'
import type { SnapshotResponse } from '@/types/api'

const props = defineProps<{
  projectId: number | null
}>()

const emit = defineEmits<{
  restore: [snapshotId: number, shapesData: string]
}>()

const { fetchSnapshots, snapshots, isLoading, error } = useSnapshots()

const loadSnapshots = async () => {
  if (!props.projectId) return
  
  try {
    await fetchSnapshots(props.projectId)
  } catch (err) {
    console.error('Failed to load snapshots:', err)
  }
}

const handleRestore = (snapshot: SnapshotResponse) => {
  emit('restore', snapshot.id, snapshot.shapesData)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

watch(() => props.projectId, loadSnapshots, { immediate: true })

onMounted(loadSnapshots)
</script>

<template>
  <div class="history-view">
    <h3>History</h3>
    
    <div v-if="isLoading" class="loading">Loading history...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="snapshots.length === 0" class="empty">
      No snapshots yet. Save your work to create history.
    </div>
    
    <div v-else class="snapshot-list">
      <div 
        v-for="snapshot in snapshots" 
        :key="snapshot.id"
        class="snapshot-item"
      >
        <div class="snapshot-info">
          <span class="snapshot-date">{{ formatDate(snapshot.createdAt) }}</span>
        </div>
        <button 
          @click="handleRestore(snapshot)"
          class="restore-button"
        >
          Restore
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.history-view {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

h3 {
  margin-bottom: 16px;
  font-size: 18px;
  color: var(--text-primary);
}

.loading,
.error,
.empty {
  padding: 16px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.error {
  color: var(--color-error);
}

.snapshot-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.snapshot-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.snapshot-info {
  flex: 1;
}

.snapshot-date {
  font-size: 14px;
  color: var(--text-primary);
}

.restore-button {
  padding: 6px 12px;
  font-size: 13px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.restore-button:hover {
  opacity: 0.9;
}
</style>
