<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSnapshots } from '@/composables/useSnapshots'
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  projectId: number | null
  shapes: Shape[]
  hasUnsavedChanges: boolean
}>()

const emit = defineEmits<{
  saved: []
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
  if (props.hasUnsavedChanges) return 'Unsaved changes'
  return 'All changes saved'
})

const handleSave = async () => {
  console.log('🔵 Save clicked')
  console.log('  projectId:', props.projectId)
  console.log('  shapes:', props.shapes)
  console.log('  hasUnsavedChanges:', props.hasUnsavedChanges)

  if (!props.projectId) {
    console.log('❌ No projectId, aborting save')
    return
  }

  isSaving.value = true
  console.log('⏳ Saving...')

  try {
    const result = await createSnapshot(props.projectId, props.shapes)
    console.log('✅ Save successful:', result)
    emit('saved')
    console.log('📤 Emitted "saved" event')
  } catch (err) {
    console.log('❌ Save failed:', err)
  } finally {
    isSaving.value = false
    console.log('🏁 Save complete, isSaving:', isSaving.value)
  }
}
</script>

<template>
  <div class="save-status">
    <span class="status-text" :class="statusClass">
      {{ statusText }}
    </span>
    <button
      v-if="hasUnsavedChanges"
      @click="handleSave"
      :disabled="isSaving"
      class="save-button"
    >
      {{ isSaving ? 'Saving...' : 'Save' }}
    </button>
  </div>
</template>

<style scoped>
.save-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--color-background-soft);
  border-radius: 4px;
}

.status-text {
  font-size: 14px;
}

.status-saved {
  color: var(--color-text-muted);
}

.status-unsaved {
  color: var(--color-warning);
}

.status-saving {
  color: var(--color-text);
}

.status-error {
  color: var(--color-error);
}

.save-button {
  padding: 4px 12px;
  font-size: 14px;
  background: var(--color-primary);
  color: white;
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
</style>
