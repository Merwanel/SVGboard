<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSnapshots } from '@/composables/useSnapshots'
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  projectId: number | null
  shapes: Shape[]
  hasUnsavedChanges: boolean
  autoSaveEnabled: boolean
  lastSaveType: 'manual' | 'auto'
}>()

const emit = defineEmits<{
  saved: []
  toggleAutoSave: []
}>()

const { createSnapshot, error } = useSnapshots()
const isSaving = ref(false)

const statusClass = computed(() => {
  if (error.value) return 'status-error'
  if (isSaving.value) return 'status-saving'
  if (props.hasUnsavedChanges) return 'status-unsaved'
  return 'status-saved'
})

const statusText = computed(() => {
  if (error.value) return `Error: ${error.value}`
  if (isSaving.value) return 'Saving...'
  if (props.hasUnsavedChanges) {
    return props.autoSaveEnabled ? 'Auto-saving...' : 'Unsaved changes'
  }
  if (props.lastSaveType === 'auto') return 'Auto-saved'
  return 'Saved'
})

const handleSave = async () => {
  if (!props.projectId) {
    console.log('no projectId, no save')
    return
  }

  isSaving.value = true

  try {
    await createSnapshot(props.projectId, props.shapes)
    emit('saved')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="save-status">
    <span class="status-text" :class="statusClass">
      {{ statusText }}
    </span>
    <button
      v-if="hasUnsavedChanges && !autoSaveEnabled"
      @click="handleSave"
      :disabled="isSaving"
      class="save-button"
    >
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
    <label class="auto-save-toggle">
      <input 
        type="checkbox" 
        :checked="autoSaveEnabled"
        @change="emit('toggleAutoSave')"
      />
      <span>Auto-save</span>
    </label>
  </div>
</template>

<style scoped>
.save-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--bg-primary);
  border-radius: 4px;
}

.status-text {
  font-size: 14px;
}

.status-saved {
  color: var(--text-muted);
}

.status-unsaved {
  color: var(--text-warning);
}

.status-saving {
  color: var(--text-primary);
}

.status-error {
  color: var(--text-error);
}

.save-button {
  padding: 4px 12px;
  font-size: 14px;
  background: var(--bg-primary);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover:not(:disabled) {
  opacity: 0.9;
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auto-save-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
}

.auto-save-toggle input[type="checkbox"] {
  cursor: pointer;
}
</style>
