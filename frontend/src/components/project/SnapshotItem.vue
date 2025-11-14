<script setup lang="ts">
import { formatDate } from '@/utils/dateFormat'
import SvgPreview from '@/components/common/SvgPreview.vue'
import type { SnapshotResponse } from '@/types/api'

defineProps<{
  snapshot: SnapshotResponse
}>()

const emit = defineEmits<{
  restore: [snapshotId: number, shapesData: string]
}>()
</script>

<template>
  <div 
    class="snapshot-item"
    @click="emit('restore', snapshot.id, snapshot.shapesData)"
  >
    <div class="snapshot-preview">
      <SvgPreview
        :shapes-data="snapshot.shapesData"
        size="small"
      />
    </div>
    <div class="snapshot-info">
      <p class="snapshot-date">{{ formatDate(snapshot.createdAt) }}</p>
    </div>
  </div>
</template>

<style scoped>
.snapshot-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--bg-secondary);
}

.snapshot-item:hover {
  border-color: var(--action-color);
  background: var(--action-color-medium);
}

.snapshot-preview {
  flex-shrink: 0;
}

.snapshot-info {
  flex: 1;
  min-width: 0;
}

.snapshot-date {
  margin: 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
</style>
