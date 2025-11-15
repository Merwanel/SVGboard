<script setup lang="ts">
defineProps<{
  statusText: string
  statusClass: 'saved' | 'unsaved' | 'saving' | 'error'
  showSaveButton: boolean
  isSaving: boolean
  autoSaveEnabled: boolean
}>()

const emit = defineEmits<{
  save: []
  toggleAutoSave: []
}>()
</script>

<template>
  <div class="save-status">
    <span class="status-text" :class="`status-${statusClass}`">
      {{ statusText }}
    </span>
    <button
      v-if="showSaveButton"
      @click="emit('save')"
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
